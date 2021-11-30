/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { html, TemplateResult } from '@spectrum-web-components/base';

import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/dialog/sp-dialog.js';
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/underlay/sp-underlay.js';
import '../sp-modal.js';

export default {
    title: 'Modal',
    component: 'sp-modal',
};

export const Default = (): TemplateResult => {
    return html`
        <sp-button>
            Open a modal
            <sp-modal>
                <sp-popover dialog open style="position: static">
                    Storage Space
                </sp-popover>
            </sp-modal>
        </sp-button>
    `;
};

export const dialog = (): TemplateResult => {
    const close = (event: Event): void => {
        event.target?.dispatchEvent(
            new Event('close', { bubbles: true, composed: true })
        );
    };
    return html`
        <sp-button>
            Open a modal
            <sp-modal underlay>
                <sp-dialog size="s" error>
                    <h2 slot="heading">
                        Unable to Share Project to Behance Community
                    </h2>
                    Smart filters are nondestructive and will preserve your
                    original images.
                    <sp-button
                        variant="secondary"
                        slot="button"
                        @click=${close}
                    >
                        Cancel
                    </sp-button>
                    <sp-button variant="primary" slot="button" @click=${close}>
                        Enable
                    </sp-button>
                </sp-dialog>
            </sp-modal>
        </sp-button>
    `;
};
