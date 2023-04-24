import { AIMSAccount } from '@al/core';
import { AlHeraldSubscribersV2 } from "@al/core/reporting";
import { AlCorrelationRuleV2 } from "@al/core/search";
import { AlIntegrationConnection } from "@al/core/reporting";

export interface AlThreatLevel {
    value: string;
    caption: string;
}

export interface AlGenericAlertOptions {
    accounts?: AIMSAccount[];
    threatLevels?: AlThreatLevel[]; // used in incidents
    connections?: AlIntegrationConnection[];
}

/** Alert notifications */

export interface AlNotificationCommonProperties {
    id: string;             //  derived from AlCardstackItemProperties
    caption: string;        //  derived from AlCardstackItemProperties
    toptitle?: string;
    subtitle?: string;
    createdTime?: number;                   //  from created.at changestamp on schedule or subscription
    createdBy?: string;                     //  from created.by changestamp on schedule or subscription
    modifiedTime?: number;                  //  from modified.at changestamp on schedule or subscription
    modifiedBy?: string;                    //  from modified.by changestamp on schedule or subscription
    accountId?: string;                     //  account creator - the accountId that the subscription belongs to
    subscribers?: AlHeraldSubscribersV2[];  //  a subscription without subscribers is a sad, sad thing
    filters?: object | any;                 //  raw searchlib filter object from herald subscription object
    filtersParsed?:any;                     //  SQXSearchQuery of raw filters
    active?: boolean;                       //  derived from subscription's active settings
    lastMessageSent?: number;               //  subscription's last sent timestamp
    emailSubject?: string;                  //  from subscription's options dictionary
    webhookPayload?: string;                //  from subscription's options direction
    externalId?:string;                     //  from subscription's external_id reference
    notificationType?: string;              //  from subscription's notification_type property

    // the next fields are going to be populate in the app
    searchables?: string[];
    error?: string;                         //  why is this here?
    createdByName?: string;                 //  name of user referenced by createdBy
    modifiedByName?: string;                //  name of user referenced by modifiedBy
    accounts?: string[];                    //  list of account IDs referenced by the filter
    accountsName?: {name: string, isCreator: boolean}[]; // accounts involve in the filter
    usersName?: {name: string, isCreator: boolean}[]; // users names involve in the notification
    users?: string[];                       //  list of user IDs (I presume) that correlate with the subscribers on the subscription object
    integrationsName?: string[];            //  integrations names involve in the notification
    integrations?: string[];                //  integrations ids that get the notification
    recipientsTotal?: number;               //  users amount + integrations amount + playbooks amount
    playbooksName?: string[];               //  playbooks names populated in the ui side
    playbooks?: string[];                   //  playbooks ids that are tie to the notification
}

// Indexable properties
export interface AlIncidentAlertProperties extends AlNotificationCommonProperties {
    // the next fields are going to be populate in the app
    threatLevel?: string[];                 //  threat levels (extracted from filters definition)
    escalated?: boolean;                    //  for lack of documentation a release was missed
    correlation?: AlCorrelationRuleV2;      //  correlation, if this notification was generated by a correlation rule
}

// Indexable properties
export interface AlHealthAlertProperties extends AlNotificationCommonProperties {
    deployments?: string[];
}

// Indexable properites
export interface AlScheduledReportProperties extends AlNotificationCommonProperties {
    workbookSubMenu?: string; // this is to support filter by top category risk, threat
    workbookId?: string;
    viewId?: string;
    siteId?: string;
    schedule?: object | any;
    format?: string;
    reportFilters?:any;

    // populated in the view
    workbookName?: string;
    viewName?: string;
    cadenceName?: 'daily' | 'weekly' | 'monthly' | 'every_15_minutes' | 'asap';
    artifactCount?: number;
    embedUrl?: string;
    contentUrl?: string;
    runTime?: number; // next run time
    reportFiltersSort?: string[]; // this is to know in what order paint the reportFilters
}

export type AlHeraldNotificationType = "unknown/unknown"
                                        | "incidents/alerts"
                                        | "observations/notification"
                                        | "tableau/notifications"
                                        | "search/notifications"
                                        | "health/alerts";

export interface AlNotificationTypeDescriptor {
    entityCode:string;                              //  short form used in gestalt endpoints -- e.g., scheduled_report -- referring to type of target entity
    notificationType:AlHeraldNotificationType;      //  long form used by herald -- e.g., 'tableau/notifications' -- referring to a specific notification_type record bound to templates and so forth
    group:"alert"|"scheduled";                      //  indicates whether the type of notification is invoked dynamically or on a schedule
    unimplemented?:boolean;                         //  If present and true, indicates the entity *will* exist but isn't fully functional yet
    pseudoType?:boolean;                            //  If present and true, indicates the type is a pseudo-type that doesn't actually relate 1:1 with a notification_type
}

export const alNotificationTypeDictionary:{[entityCode:string]:AlNotificationTypeDescriptor} = {
    "artifacts": {
        entityCode: "artifacts",
        notificationType: "unknown/unknown",
        group: "scheduled"
    },
    "incident": {
        entityCode: "incident",
        notificationType: "incidents/alerts",
        group: "alert"
    },
    "observation": {
        entityCode: "scheduled_report",
        notificationType: "observations/notification",
        group: "alert",
        unimplemented: true

    },
    "scheduled_report": {
        entityCode: "scheduled_report",
        notificationType: "tableau/notifications",
        group: "scheduled"
    },
    "scheduled_search": {
        entityCode: "scheduled_report",
        notificationType: "search/notifications",
        group: "scheduled"
    },
    "manage_alerts": {
        entityCode: "manage_alerts",
        notificationType: "unknown/unknown",
        group: "alert",
        pseudoType: true
    },
    "manage_scheduled": {
        entityCode: "manage_scheduled",
        notificationType: "unknown/unknown",
        group: "scheduled",
        pseudoType: true
    },
    "health":{
        entityCode: "health",
        notificationType: "health/alerts",
        group: "alert"
    }
};

export const alUnknownNotificationType:AlNotificationTypeDescriptor = {
    entityCode: "unknown",
    notificationType: "unknown/unknown",
    group: "alert",
    unimplemented: true,
    pseudoType: true
};