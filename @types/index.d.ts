import type { Collection, GuildAuditLogsActionType, Snowflake, PermissionResolvable } from 'discord.js'

declare module 'discord.js' {

    interface Guild {
        running: Set<string>
        owner: GuildMember | null
        isIgnored(id: Snowflake): boolean
        resolveAction(audit?: GuildAuditLogsEntry | null): Promise<void>
        fetchAudit(type: keyof GuildAuditLogsActions, targetId?: string): Promise<GuildAuditLogsEntry | null>
    }

    interface Role {
        isEveryone: boolean
    }

    interface GuildMember {
        dm(message: string): Promise<boolean>
    }
}

export interface IConfig {
    TIMEOUT: number
    CHECK_MESSAGE: string
    LIMITS: { [key in GuildAuditLogsActionType]: number }
    WHITE_LIST: Snowflake[]
    IGNORED_CHANNELS: Snowflake[]
    BAD_PERMISSIONS: PermissionResolvable[]
}

export type ActionCollection = Collection<string, {
    id: string
    executorId: Snowflake
    guildId: string
    type: GuildAuditLogsActionType
    timestamp: number
}>