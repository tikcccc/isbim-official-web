import type { StructureResolver } from "sanity/desk";

const CUSTOMIZED_TYPES = new Set(["applicationSettings", "contactFormSubmission"]);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Application URL")
        .id("applicationSettings")
        .child(
          S.document()
            .schemaType("applicationSettings")
            .documentId("applicationSettings")
        ),
      S.listItem()
        .title("Contact Form")
        .id("contactFormSubmission")
        .child(
          S.documentTypeList("contactFormSubmission")
            .title("Contact Form")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !CUSTOMIZED_TYPES.has(listItem.getId() || "")
      ),
    ]);
