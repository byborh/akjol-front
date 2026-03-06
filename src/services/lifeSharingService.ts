import type { LifeSession } from '../types';

const SHARE_QUERY_KEY = 'shareLife';
const PAYLOAD_VERSION = 1;

type SharedLifePayload = {
  version: number;
  exportedAt: number;
  life: LifeSession;
};

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(paddingLength);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLifeSession(value: unknown): value is LifeSession {
  if (!isRecord(value)) return false;
  if (typeof value.id !== 'string') return false;
  if (typeof value.name !== 'string') return false;
  if (typeof value.createdAt !== 'number') return false;
  if (!Array.isArray(value.path)) return false;

  const stats = value.stats;
  if (!isRecord(stats)) return false;
  if (typeof stats.wallet !== 'number') return false;
  if (typeof stats.stress !== 'number') return false;
  if (typeof stats.age !== 'number') return false;

  if (
    typeof value.startingNodeId !== 'number' &&
    value.startingNodeId !== null &&
    value.startingNodeId !== undefined
  ) {
    return false;
  }

  return true;
}

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function parsePayloadFromToken(token: string): SharedLifePayload {
  const decoded = fromBase64Url(token);
  const parsed = JSON.parse(decoded) as unknown;

  if (!isRecord(parsed)) {
    throw new Error('Le format de partage est invalide.');
  }

  if (parsed.version !== PAYLOAD_VERSION) {
    throw new Error('Cette version de partage n est pas supportee.');
  }

  if (typeof parsed.exportedAt !== 'number') {
    throw new Error('Metadonnees de partage invalides.');
  }

  if (!isLifeSession(parsed.life)) {
    throw new Error('La vie partagee est invalide.');
  }

  return parsed as SharedLifePayload;
}

function extractTokenFromInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Collez un lien ou un token de partage.');
  }

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    return trimmed;
  }

  const token = url.searchParams.get(SHARE_QUERY_KEY);
  if (!token) {
    throw new Error('Ce lien ne contient pas de vie partagee.');
  }

  return token;
}

export const LifeSharingService = {
  createShareToken(session: LifeSession): string {
    const payload: SharedLifePayload = {
      version: PAYLOAD_VERSION,
      exportedAt: Date.now(),
      life: session
    };

    return toBase64Url(JSON.stringify(payload));
  },

  buildShareUrl(token: string): string {
    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_QUERY_KEY, token);
    return url.toString();
  },

  buildShareUrlForSession(session: LifeSession): string {
    const token = this.createShareToken(session);
    return this.buildShareUrl(token);
  },

  importSessionFromInput(input: string): LifeSession {
    const token = extractTokenFromInput(input);
    const payload = parsePayloadFromToken(token);

    return {
      ...payload.life,
      id: createSessionId(),
      createdAt: Date.now(),
      name: payload.life.name.trim() || 'Vie importee'
    };
  },

  consumeTokenFromCurrentUrl(): string | null {
    const url = new URL(window.location.href);
    const token = url.searchParams.get(SHARE_QUERY_KEY);

    if (!token) {
      return null;
    }

    url.searchParams.delete(SHARE_QUERY_KEY);
    window.history.replaceState({}, document.title, url.toString());

    return token;
  }
};
