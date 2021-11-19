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

import '@spectrum-web-components/theme/theme-lightest.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/thumbnail/sp-thumbnail.js';
import type { Thumbnail } from '@spectrum-web-components/thumbnail';

document
    .querySelector('.css-custom-property-listing')
    ?.addEventListener('click', (event: Event) => {
        if ((event.target as HTMLElement).classList?.contains('sample')) {
            (event.target as HTMLElement).dispatchEvent(
                new CustomEvent('copy-text', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        text: (event.target as Thumbnail).background,
                        message: 'CSS Custom Property copied to clipboard!',
                    },
                })
            );
        }
    });
