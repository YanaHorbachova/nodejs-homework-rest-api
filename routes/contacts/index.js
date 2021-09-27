const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateContactStatus,
  validationObjectId,
  validationQueryContact,
} = require("./validation");
const guard = require("../../helpers/guard");

router
  .get("/", guard, validationQueryContact, ctrl.getAll)
  .post("/", guard, validationCreateContact, ctrl.create);

router
  .get("/:contactId", guard, validationObjectId, ctrl.getById)
  .put("/:contactId", guard, validationUpdateContact, ctrl.update)
  .delete("/:contactId", guard, ctrl.remove);

router.patch(
  "/:contactId/favorite",
  guard,
  validationUpdateContactStatus,
  ctrl.updateStatus
);

module.exports = router;