// Copyright 2023 @polkadot-cloud/polkadot-cloud authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ReactElement } from "react";

import { faExternalLinkAlt, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useOverlay } from "@polkadot-cloud/react/overlay/OverlayProvider/useOverlay";

import {
  Button,
  ModalConnectItem,
  ModalHardwareItem,
} from "@polkadot-cloud/react";
import { PolkadotVault } from "@polkadot-cloud/assets/extensions/jsx/PolkadotVault";

import "./index.scss";

export const Vault = (): ReactElement => {
  const { replaceModal } = useOverlay().modal;
  const url = "signer.parity.io";

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
        <div className="body">
          <div className="status"></div>
          <div className="row">
            <div className="logo vault">
              <PolkadotVault />
            </div>
          </div>
          <div className="row margin">
            <Button
              type="text"
              text="Polkadot Vault"
              disabled
              marginRight
              style={{
                opacity: 1,
                color: "var(--accent-color-primary)",
                fontFamily: "Unbounded",
              }}
            />
          </div>
          <div className="row margin">
            <Button
              type="primaryInvert"
              text="Import"
              onClick={() => {
                replaceModal({ key: "ImportVault" });
              }}
              iconLeft={faQrcode}
              iconTransform="shrink-1"
            />
          </div>
        </div>
        <div className="foot">
          <a
            className="link"
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
          >
            {url}
            <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
          </a>
        </div>
      </ModalHardwareItem>
    </ModalConnectItem>
  );
};
