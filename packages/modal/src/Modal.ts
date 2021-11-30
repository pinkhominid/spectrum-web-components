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

import {
    CSSResultArray,
    html,
    PropertyValues,
    SpectrumElement,
    TemplateResult,
} from '@spectrum-web-components/base';
import { property } from '@spectrum-web-components/base/src/decorators.js';
import { openOverlay } from '@spectrum-web-components/overlay/src/loader.js';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';

import modalWrapperStyles from './modal-wrapper.css.js';
import modalStyles from './modal.css.js';

export class Modal extends SpectrumElement {
    public static get styles(): CSSResultArray {
        return [modalWrapperStyles, modalStyles];
    }

    @property({ type: Boolean, attribute: 'managed' })
    public managed = false;

    @property({ type: Boolean, reflect: true })
    public open = false;

    protected prefersMotion = new MatchMediaController(
        this,
        '(prefers-reduced-motion: no-preference)'
    );

    @property({ type: Boolean })
    public shouldOpen = false;

    private transitionPromise = Promise.resolve();

    private resolveTransitionPromise!: () => void;

    @property({ type: Boolean })
    public underlay = false;

    private closeOverlayCallback?: Promise<() => void>;
    private abortOverlay: (cancelled: boolean) => void = () => {
        return;
    };

    private _proxy!: HTMLElement;

    private shouldCloseOverlay(event: Event): void {
        const path = event.composedPath();
        const modal = path.find(
            (el) =>
                (el as HTMLElement).classList &&
                (el as HTMLElement).classList.contains('modal')
        );
        if (!modal) {
            this.closeOverlay();
        }
    }

    private generateProxy(): void {
        if (!this._proxy) {
            this._proxy = document.createElement('overlay-proxy');
            this._proxy.slot = 'hidden-tooltip-content';
        }
    }

    private handleTriggerClick = (): void => {
        this.openOverlay();
    };

    private openOverlay(): void {
        const parentElement = this.parentElement as HTMLElement;
        const abortPromise: Promise<boolean> = new Promise((res) => {
            this.abortOverlay = res;
        });
        this.generateProxy();
        this.insertAdjacentElement('beforebegin', this._proxy);
        this.closeOverlayCallback = openOverlay(parentElement, 'modal', this, {
            abortPromise,
            placement: 'none',
            receivesFocus: 'auto',
        });
        this._proxy.addEventListener('disconnected', this.closeOverlay);
        this.addEventListener('click', this.shouldCloseOverlay);
    }

    private closeOverlay = async (): Promise<void> => {
        this.removeEventListener('click', this.shouldCloseOverlay);
        this._proxy.remove();
        if (this.abortOverlay) this.abortOverlay(true);
        if (!this.closeOverlayCallback) return;
        const closeOverlay = this.closeOverlayCallback;
        delete this.closeOverlayCallback;
        (await closeOverlay)();
    };

    private previousSlot?: string;

    private manageModal(): void {
        const parentElement = this.parentElement as HTMLElement;
        if (!this.managed) {
            if (this.slot) {
                this.previousSlot = this.slot;
            }
            this.slot = 'self-managed-modal';
            parentElement.addEventListener('click', this.handleTriggerClick);
        } else {
            if (this.previousSlot) {
                this.slot = this.previousSlot;
            } else if (this.slot === 'self-managed-modal') {
                this.removeAttribute('slot');
            }
            parentElement.removeEventListener('click', this.handleTriggerClick);
        }
    }

    public overlayWillCloseCallback(): boolean {
        if (!this.open) return false;
        this.open = false;
        return true;
    }

    private dispatchClosed(): void {
        this.dispatchEvent(
            new Event('close', {
                bubbles: true,
            })
        );
    }

    protected handleUnderlayTransitionend(): void {
        if (!this.open) {
            this.dispatchClosed();
            this.resolveTransitionPromise();
        }
    }

    protected handleTrayTransitionend(): void {
        if (this.open) {
            this.resolveTransitionPromise();
        }
    }

    protected handleClose(event: Event): void {
        event.stopPropagation();
        this.open = false;
    }

    protected render(): TemplateResult {
        return html`
            ${this.underlay
                ? html`
                      <sp-underlay
                          ?open=${this.open}
                          @click=${this.handleClose}
                          @transitionend=${this.handleUnderlayTransitionend}
                      ></sp-underlay>
                  `
                : html``}
            <div
                @close=${this.handleClose}
                class="modal"
                @transitionend=${this.handleTrayTransitionend}
            >
                <slot></slot>
            </div>
        `;
    }

    protected async update(changed: PropertyValues<this>): Promise<void> {
        if (changed.has('managed')) {
            this.manageModal();
        }
        if (
            changed.has('open') &&
            changed.get('open') !== undefined &&
            this.prefersMotion.matches
        ) {
            this.transitionPromise = new Promise(
                (res) => (this.resolveTransitionPromise = res)
            );
        }
        super.update(changed);
    }

    /**
     * Bind the open/close transition into the update complete lifecycle so
     * that the overlay system can wait for it to be "visibly ready" before
     * attempting to throw focus into the content contained herein. Not
     * waiting for this can cause small amounts of page scroll to happen
     * while opening the Tray when focusable content is included: e.g. Menu
     * elements whose selected Menu Item is not the first Menu Item.
     */
    protected async getUpdateComplete(): Promise<boolean> {
        const complete = (await super.getUpdateComplete()) as boolean;
        await this.transitionPromise;
        return complete;
    }
}
