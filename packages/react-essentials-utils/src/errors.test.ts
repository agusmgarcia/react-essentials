import * as errors from "./errors";

describe("errors", () => {
  describe("emit", () => {
    it("should throw an error when passed an Error object", () => {
      const error = new Error("Test error");
      expect(() => errors.emit(error)).toThrow("Test error");
    });

    it("should throw an error when passed a string message", () => {
      expect(() => errors.emit("Test error message")).toThrow(
        "Test error message",
      );
    });

    it("should throw an error with options when passed a string message and options", () => {
      const options = { cause: new Error("Cause error") };
      expect(() => errors.emit("Test error with options", options)).toThrow(
        "Test error with options",
      );
    });

    it("should throw the same error object when passed an Error object", () => {
      const error = new Error("Original error");
      try {
        errors.emit(error);
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });

  describe("getMessage", () => {
    it("should return the message from an Error object", () => {
      const error = new Error("Error message");
      expect(errors.getMessage(error)).toBe("Error message");
    });

    it("should return the string itself if passed a string", () => {
      expect(errors.getMessage("A string error")).toBe("A string error");
    });

    it("should return the fallback message if error has no message", () => {
      const notFound = "Fallback message";
      expect(errors.getMessage({} as any, notFound)).toBe(notFound);
    });

    it("should return the default message if error has no message and no fallback is provided", () => {
      expect(errors.getMessage({} as any)).toBe("An unexpected error occurred");
    });

    it("should return the fallback message if error is null", () => {
      expect(errors.getMessage(null, "Not found")).toBe("Not found");
    });

    it("should return the default message if error is undefined", () => {
      expect(errors.getMessage(undefined)).toBe("An unexpected error occurred");
    });

    it("should return the message if error is an object with a string message property", () => {
      const errorObj = { message: "Custom error message" };
      expect(errors.getMessage(errorObj)).toBe("Custom error message");
    });

    it("should return the fallback if error is an object with a non-string message property", () => {
      const errorObj = { message: 123 };
      expect(errors.getMessage(errorObj, "Fallback")).toBe("Fallback");
    });
  });

  describe("handle", () => {
    describe("synchronous", () => {
      it("should return the result of the callback if no error is thrown", () => {
        const result = errors.handle(
          () => 42,
          () => "caught",
        );
        expect(result).toBe(42);
      });

      it("should call catchCallback if callback throws", () => {
        const err = new Error("fail");
        const catchCallback = jest.fn().mockReturnValue("caught");
        const result = errors.handle(() => {
          throw err;
        }, catchCallback);
        expect(catchCallback).toHaveBeenCalledWith(err);
        expect(result).toBe("caught");
      });

      it("should pass the thrown value to catchCallback (non-Error)", () => {
        const catchCallback = jest.fn().mockReturnValue("caught");
        const thrown = "fail";
        const result = errors.handle(() => {
          throw thrown;
        }, catchCallback);
        expect(catchCallback).toHaveBeenCalledWith(thrown);
        expect(result).toBe("caught");
      });
    });

    describe("asynchronous", () => {
      it("should resolve to the result of the callback if no error is thrown", async () => {
        const result = await errors.handle(
          async () => 99,
          () => "caught",
        );
        expect(result).toBe(99);
      });

      it("should call catchCallback if callback rejects", async () => {
        const err = new Error("async fail");
        const catchCallback = jest.fn().mockResolvedValue("caught");
        const result = await errors.handle(async () => {
          throw err;
        }, catchCallback);
        expect(catchCallback).toHaveBeenCalledWith(err);
        expect(result).toBe("caught");
      });

      it("should call catchCallback if callback returns a rejected promise", async () => {
        const err = new Error("promise fail");
        const catchCallback = jest.fn().mockResolvedValue("caught");
        const result = await errors.handle(
          () => Promise.reject(err),
          catchCallback,
        );
        expect(catchCallback).toHaveBeenCalledWith(err);
        expect(result).toBe("caught");
      });

      it("should pass the rejected value to catchCallback (non-Error)", async () => {
        const catchCallback = jest.fn().mockResolvedValue("caught");
        const thrown = "fail";
        const result = await errors.handle(
          () => Promise.reject(thrown),
          catchCallback,
        );
        expect(catchCallback).toHaveBeenCalledWith(thrown);
        expect(result).toBe("caught");
      });
    });
  });
});
