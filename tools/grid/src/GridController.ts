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
import type { ReactiveController, ReactiveElement } from 'lit';

import { ResizeController } from '@lit-labs/observers/resize_controller.js';
import { RovingTabindexController } from '@spectrum-web-components/reactive-controllers/src/RovingTabindex.js';
import { RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';

interface ItemSize {
    width: number;
    height: number;
}

export class GridController<T extends HTMLElement>
    implements ReactiveController
{
    host!: ReactiveElement;

    resizeController!: ResizeController;

    rovingTabindexController!: RovingTabindexController<T>;

    get itemSize(): ItemSize {
        return this._itemSize();
    }

    private _itemSize(): ItemSize {
        return {
            width: 0,
            height: 0,
        };
    }

    get gap(): string | undefined {
        return this._gap();
    }

    private _gap(): string | undefined {
        return undefined;
    }

    constructor(
        host: ReactiveElement,
        {
            elements,
            itemSize,
            gap,
        }: {
            elements: () => T[];
            itemSize: ItemSize | (() => ItemSize);
            gap?: string | (() => string);
        }
    ) {
        this.host = host;
        if (typeof itemSize === 'object') {
            this._itemSize = () => itemSize;
        } else if (typeof itemSize === 'function') {
            this._itemSize = itemSize;
        }
        if (typeof gap === 'string') {
            this._gap = () => gap;
        } else if (typeof gap === 'function') {
            this._gap = gap;
        }
        this.resizeController = new ResizeController(this.host, {
            callback: (entries: ResizeObserverEntry[]): void => {
                entries.forEach((entry) => {
                    this.measureDirectionLength(entry.contentRect);
                });
            },
        });
        this.rovingTabindexController = new RovingTabindexController<T>(
            this.host,
            {
                direction: 'grid',
                elements,
            }
        );
    }

    public update({
        elements,
        itemSize,
        gap,
    }: {
        elements: () => T[];
        itemSize: ItemSize | (() => ItemSize);
        gap?: string | (() => string);
    }): void {
        this.rovingTabindexController.update({ elements });
        if (typeof itemSize === 'object') {
            this._itemSize = () => itemSize;
        } else if (typeof itemSize === 'function') {
            this._itemSize = itemSize;
        }
        if (typeof gap === 'string') {
            this._gap = () => gap;
        } else if (typeof gap === 'function') {
            this._gap = gap;
        }
        const contentRect = this.host.getBoundingClientRect();
        this.measureDirectionLength(contentRect);
        this.host.addEventListener('rangeChanged', this.handleRangeChanged);
    }

    protected measureDirectionLength(contentRect: DOMRect): void {
        const gap = this.gap ? parseFloat(this.gap) : 0;
        this.rovingTabindexController.directionLength = Math.floor(
            (contentRect.width - gap) / (this.itemSize.width + gap)
        );
    }

    protected handleRangeChanged = (event: RangeChangedEvent): void => {
        this.rovingTabindexController.clearElementCache(event.first);
    };

    public hostConnected(): void {
        this.host.addEventListener('rangeChanged', this.handleRangeChanged);
    }

    public hostDisconnected(): void {
        this.host.removeEventListener('rangeChanged', this.handleRangeChanged);
    }
}
