const guard = require("../helpers/guard");
const { HttpCode } = require("../helpers/constants");
const passport = require("passport");

// jest.mock("../config/passport");
describe("Unit test guard", () => {
  const user = { token: "12345" };
  const req = { get: jest.fn((header) => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  test("user exist", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, user);
      }
    );
    guard(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});