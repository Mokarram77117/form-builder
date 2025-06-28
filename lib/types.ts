export interface FormField {
  id: string
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "file"
    | "rating"
    | "phone"
    | "url"
    | "color"
    | "range"
    | "time"
    | "datetime"
    | "password"
    | "hidden"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  conditionalLogic?: {
    showIf?: {
      fieldId: string
      operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty"
      value: string | number
    }[]
  }
  styling?: {
    width?: "full" | "half" | "third" | "quarter"
    alignment?: "left" | "center" | "right"
    customCSS?: string
  }
  advanced?: {
    defaultValue?: string
    helpText?: string
    characterLimit?: number
    allowMultiple?: boolean
    acceptedFileTypes?: string[]
    maxFileSize?: number
  }
}

export interface FormData {
  id: string
  name: string
  description: string
  fields: FormField[]
  settings: {
    theme: {
      primaryColor: string
      backgroundColor: string
      fontFamily: string
      logo?: string
      customCSS?: string
    }
    notifications: {
      email?: string
      webhook?: string
      slack?: string
    }
    allowMultipleSubmissions: boolean
    requireAuth: boolean
    showProgressBar: boolean
    customTheme: string
    redirectUrl?: string
    thankYouMessage?: string
    enableCaptcha?: boolean
    enableSaveAndContinue?: boolean
    enablePasswordProtection?: boolean
    password?: string
    enableScheduling?: boolean
    startDate?: string
    endDate?: string
    maxSubmissions?: number
    enableGeolocation?: boolean
    enableAnalytics?: boolean
    enableA11y?: boolean
  }
  status: "draft" | "published" | "archived" | "scheduled"
  submissions: number
  createdAt: string
  updatedAt: string
  lastResponse?: string
  conversionRate?: number
  views?: number
  completionRate?: number
  averageTime?: number
  tags?: string[]
  category?: string
  version?: number
  collaborators?: string[]
}

export interface FormSubmission {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: string
  ipAddress?: string
  userAgent?: string
  location?: {
    country?: string
    city?: string
    coordinates?: [number, number]
  }
  duration?: number
  referrer?: string
  device?: {
    type: "desktop" | "mobile" | "tablet"
    os?: string
    browser?: string
  }
  status: "completed" | "partial" | "abandoned"
  score?: number
  flags?: string[]
}

export interface WorkflowTrigger {
  id: string
  type: "field_value" | "form_submitted" | "rating_threshold" | "time_based" | "submission_count" | "completion_rate"
  fieldId?: string
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty"
  value: string | number
  conditions?: {
    timeDelay?: number
    dayOfWeek?: number[]
    timeOfDay?: string
  }
}

export interface WorkflowAction {
  id: string
  type:
    | "send_email"
    | "webhook"
    | "slack_notification"
    | "create_task"
    | "update_crm"
    | "send_sms"
    | "add_to_list"
    | "trigger_zapier"
  config: {
    email?: {
      to: string
      cc?: string
      bcc?: string
      subject: string
      message: string
      template?: string
      attachments?: string[]
    }
    webhook?: {
      url: string
      method: "POST" | "GET" | "PUT" | "DELETE"
      headers?: Record<string, string>
      payload?: Record<string, any>
      authentication?: {
        type: "bearer" | "basic" | "api_key"
        token?: string
        username?: string
        password?: string
        apiKey?: string
      }
    }
    slack?: {
      webhook: string
      channel: string
      message: string
      username?: string
      iconEmoji?: string
    }
    sms?: {
      to: string
      message: string
      provider: "twilio" | "nexmo" | "aws_sns"
    }
    crm?: {
      provider: "salesforce" | "hubspot" | "pipedrive"
      action: "create_contact" | "update_contact" | "create_deal"
      mapping: Record<string, string>
    }
  }
  delay?: number
  conditions?: {
    onlyOnce?: boolean
    skipWeekends?: boolean
    businessHoursOnly?: boolean
  }
}

export interface Workflow {
  id: string
  name: string
  description?: string
  formId: string
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  executionCount?: number
  successRate?: number
  lastExecuted?: string
  tags?: string[]
}

export interface AppTheme {
  primaryColor: string
  backgroundColor: string
  fontFamily: string
  logo?: string
  customCSS?: string
  darkMode?: boolean
  borderRadius?: "none" | "small" | "medium" | "large"
  animations?: boolean
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  fields: FormField[]
  settings: FormData["settings"]
  isPremium: boolean
  downloads: number
  rating: number
  tags: string[]
  createdAt: string
  author: string
}

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: "email" | "crm" | "analytics" | "payment" | "storage" | "communication"
  isActive: boolean
  config: Record<string, any>
  lastSync?: string
  status: "connected" | "disconnected" | "error"
}

export interface Analytics {
  formId: string
  period: "day" | "week" | "month" | "year"
  data: {
    views: number
    submissions: number
    conversionRate: number
    averageTime: number
    completionRate: number
    bounceRate: number
    topSources: Array<{ source: string; count: number }>
    deviceBreakdown: Array<{ device: string; count: number }>
    locationData: Array<{ country: string; count: number }>
    fieldAnalytics: Array<{ fieldId: string; dropoffRate: number; errorRate: number }>
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "editor" | "viewer"
  plan: "free" | "pro" | "enterprise"
  permissions: string[]
  lastActive: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  members: User[]
  plan: "free" | "pro" | "enterprise"
  settings: {
    allowGuestAccess: boolean
    requireTwoFactor: boolean
    sessionTimeout: number
  }
}
