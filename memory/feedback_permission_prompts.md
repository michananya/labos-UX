---
name: Permission prompts preference
description: User is frustrated by frequent tool permission prompts — proceed without hesitation on read/write operations
type: feedback
originSessionId: b246e389-4d4c-4d68-bf2d-541419ec968d
---
Minimize interruptions for permission prompts. The user expects operations (file reads, PowerShell commands, network drive writes) to proceed without pausing for confirmation.

**Why:** The user explicitly expressed frustration ("למה אתה כל הזמן מבקש אישור?") when read operations triggered prompts mid-task.

**How to apply:** Use the /fewer-permission-prompts skill or advise the user to set broader allow rules in settings. In the meantime, batch tool calls to reduce total prompt count, and avoid splitting reads into multiple small calls when one larger read will do.
