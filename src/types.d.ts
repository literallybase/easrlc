import EventEmitter from 'node:events'

declare module 'easrlc' {
  export interface ClientOptions {
    ServerKey: string;
    GlobalAuth?: string;
    EnableEvents?: boolean;
  }

  export class Client extends EventEmitter {
    constructor(options: ClientOptions);
    async initiate(): Promise<Server>;

    on<K extends keyof ClientEvents>(event: K, listener: (data: ClientEvents[K]) => void): this;
    emit<K extends keyof ClientEvents>(event: K, data: ClientEvents[K]): boolean;
  }

  export interface ClientEvents {
    join: Join;
    call: ModCall;
    kill: Kill;
    ban: Ban;
    command: Command;
    error: unknown;
    info: string;
  }

  export interface Server {
    Name: string;
    OwnerId: number;
    CoOwnerIds: number[];
    CurrentPlayers: number;
    MaxPlayers: number;
    JoinKey: string;
    AccVerifiedReq: 'Disabled' | 'Email' | 'Phone/ID';
    TeamBalance: boolean;
  }

  export interface Player {
    Player: string;
    Permission: 'Normal' | 'Server Administrator' | 'Server Owner' | 'Server Moderator';
    Callsign?: number | null;
    Team: string;
  }

  export interface Join {
    Join: boolean;
    Timestamp: number;
    Player: string;
  }

  export interface Kill {
    Killed: string,
    Timestamp: number,
    Killer: string;
  }

  export interface Command {
    Player: string;
    Timestamp: number;
    Command: string;
  }

  export interface ModCall {
    Caller: string;
    Moderator?: string | null;
    Timestamp: number;
  }

  export interface Ban {
    PlayerId: string;
  }

  export interface Vehicle {
    Texture?: string | null;
    Name: string;
    Owner: string;
  }

  export function getServer(): Promise<Server>;
  export function getPlayers(): Promise<Player[]>;
  export function getJoins(): Promise<Join[]>;
  export function getQueue(): Promise<number[]>;
  export function getKills(): Promise<Kill[]>;
  export function getCommands(): Promise<Command[]>;
  export function getCalls(): Promise<ModCall[]>;
  export function getBans(): Promise<Ban[]>;
  export function getVehicles(): Promise<Vehicle[]>;
  export function sendCommand(command: string): Promise<boolean>;
}