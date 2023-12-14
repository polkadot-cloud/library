/* @license Copyright 2023 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { faArrowAltCircleUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../packages/cloud-react/lib/buttons/Button";
import { Page } from "../components/Page";

export const Buttons = () => {
  return (
    <div className="page">
      <Page>
        <h1>Buttons</h1>
        <p>A small collection of plug-and-play button components.</p>

        <h4>Button Primary</h4>
        <div className="row">
          <Button text="Button" marginRight />
          <Button type="primary" text="Button" iconLeft={faUser} marginRight />
          <Button
            type="primary"
            text="Button"
            iconLeft={faUser}
            marginRight
            colorSecondary
          />
          <Button type="primary" text="Button" lg disabled />
        </div>

        <h4>Button Primary Invert</h4>
        <div className="row">
          <Button type="primaryInvert" text="Button" marginRight />
          <Button
            type="primaryInvert"
            text="Button"
            iconLeft={faUser}
            marginRight
            colorSecondary
          />
          <Button
            type="primaryInvert"
            text="Button"
            iconRight={faUser}
            marginRight
          />
          <Button type="primaryInvert" lg text="Button" disabled />
        </div>

        <h4>Button Secondary</h4>
        <div className="row">
          <Button type="secondary" text="Button" marginRight />
          <Button
            type="secondary"
            text="Button"
            iconLeft={faUser}
            marginRight
          />
          <Button
            type="secondary"
            text="Button"
            iconRight={faUser}
            marginRight
          />
          <Button type="secondary" lg text="Button" disabled />
        </div>

        <h4>Button Tertiary</h4>
        <div className="row">
          <Button type="tertiary" text="Button" marginRight />
          <Button type="tertiary" text="Button" iconLeft={faUser} marginRight />
          <Button
            type="tertiary"
            text="Button"
            iconRight={faUser}
            marginRight
          />
          <Button type="tertiary" text="Button" disabled />
        </div>

        <h4>Button Text</h4>
        <div className="row">
          <Button type="text" text="Button" marginRight />
          <Button type="text" text="Button" iconLeft={faUser} marginRight />
          <Button type="text" text="Button" iconRight={faUser} marginRight />
          <Button type="text" text="Button" disabled />
        </div>

        <h4>Button Submit</h4>
        <div className="row">
          <Button type="submit" text="Button" marginRight />
          <Button type="submit" text="Button" marginRight lg />
          <Button
            type="submit"
            text="Button"
            iconLeft={faArrowAltCircleUp}
            marginRight
            colorSecondary
          />
          <Button type="submit" text="Button" pulse marginRight />
          <Button type="submit" text="Button" disabled />
        </div>

        <h4>Button Submit Invert</h4>
        <div className="row">
          <Button type="submitInvert" text="Button" marginRight />
          <Button type="submitInvert" text="Button" marginRight lg />
          <Button
            type="submitInvert"
            text="Button"
            iconLeft={faUser}
            marginRight
          />
          <Button
            type="submitInvert"
            text="Button"
            iconRight={faUser}
            marginRight
          />
          <Button type="submitInvert" text="Button" disabled />
        </div>

        <h4>Button Tab</h4>
        <div className="row">
          <Button type="tab" title={"Inactive"} />
          <Button type="tab" title={"Inactive"} badge={"123"} />
          <Button type="tab" active title={"Active"} />
          <Button type="tab" active title={"Active"} badge={"123"} />
        </div>

        <h4>Button Mono</h4>
        <div className="row">
          <Button type="mono" text="Button" marginRight />
          <Button type="mono" text="Button" iconLeft={faUser} marginRight />
          <Button type="mono" text="Button" iconRight={faUser} marginRight />
          <Button type="mono" lg text="Button" disabled />
        </div>

        <h4>Button Mono Invert</h4>
        <div className="row">
          <Button type="monoInvert" text="Button" marginRight />
          <Button
            type="monoInvert"
            text="Button"
            iconLeft={faUser}
            marginRight
          />
          <Button
            type="monoInvert"
            text="Button"
            iconRight={faUser}
            marginRight
          />
          <Button type="monoInvert" lg text="Button" disabled />
        </div>

        <h4>Button Help</h4>
        <div className="row">
          <Button type="help" marginRight />
          <Button type="help" background="secondary" marginRight />
          <Button type="help" background="none" outline />
        </div>
      </Page>
    </div>
  );
};
