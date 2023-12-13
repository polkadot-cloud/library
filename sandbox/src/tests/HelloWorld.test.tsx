import { $, expect } from "@wdio/globals";
import { render } from "@testing-library/react";
import App from "../App";
import { describe, it } from "mocha";

describe("React Component Testing", () => {
  it("increments value on click", async () => {
    // The render method returns a collection of utilities to query your component.
    const { getByText } = render(<App />);

    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    const btn = getByText("count is 0");
    const button = await $(btn);

    // Dispatch a native click event to our button element.
    await button.click();
    await button.click();

    await expect($("button*=count is")).toHaveText("count is 2");
  });
});
