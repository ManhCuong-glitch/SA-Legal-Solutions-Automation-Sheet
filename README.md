# SA-Legal-Solutions-Automation-Sheet
Automations built behind SA Legal's Google Sheet automation hub. Contract started 12-20-19.

## SA Legal Automation Station Usage Tips
- New depositions should be added via the sidebars that can be activated by making a selection in the ⚖️ SA Legal Services menu, not by adding information directly to the "Schedule a depo" Sheet. Key features of the App (e.g. automatic adding of calendar events, order activity logging) are activated when the sidebars are used.
- **Nobody** should edit the layout of the "Schedule a depo" Sheet. Many of the automations depend on the layout of this Sheet remaining the way it is.
- **Do not modify data formats within the Automation Station.** For example, do not change the format of Column G in the "Schedule a depo" Sheet from "Plain Text" to something else. In many cases, the Application expects data in the a particular format.
- If someone is using the Automation Station to add or modify depositions (or the Google Calendar events associated with them), the email address they're logged in with will need to have full access ("Make changes and manage sharing") to Blake's Services Google Calendar.
- When using the sidebars, some fields in the form are pre-filled (e.g. the City values default to San Antonio). These can be easily overwritten, and are just there to save time so that, in case they don't need to be changed, they're ready to go.

### Layout Changes to SA Legal Automation Station v2
1. Added Status column (column A) to the "Schedule a depo" Sheet. This can be used to change the status of depositions, which will make changes to the Services Google Calendar and to the "Current List" Sheet.
2. Added Event ID column (column AK) to the "Schedule a depo" Sheet. The data in this column *should not be modified*--it is automatically generated and used to link depositions with specific events on the Services Google Calendar.
