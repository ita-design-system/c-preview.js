---
title: Template reset personnalisé
description: Exemple avec un template personnalisé de retrait de tous les fichiers
layout: libdoc/page-split
category: Exemples
order: 30
---

```html
<label for="first">Template reset nommé "foo"</label>
<input type="file" id="first" multiple>
<div data-cpreview="first"
    data-cpreview-template-reset="foo"></div>
<hr>
<label for="second">Template reset nommé "minimal"</label>
<input type="file" id="second" multiple>
<div data-cpreview="second"
    data-cpreview-template-reset="minimal"></div>
<hr>
<label for="second">Cas template reset inexistant "foobar"</label>
<input type="file" id="third" multiple>
<div data-cpreview="third"
    data-cpreview-template-reset="foobar"></div>
```
{:.playground title="Template reset personnalisé"}

Quand l'attribut `data-cpreview-template-reset="TOKEN_TEMPLATE_RESET"` est renseigné, cPreview invoque `cPreviewTemplates[TOKEN_TEMPLATE_RESET]` et l'utilise pour générer le HTML du template réinitialisation / retrait de tous les fichiers sélectionnés.

Pour ajouter un template de réinitialisation, ajouter une méthode dans l'objet `cPreviewTemplates.reset[TOKEN_NOM_DU NOUVEAU_TEMPLATE]`, sur la base de l'exemple suivant:

```javascript
// cPreview Templates optionnels
let cPreviewTemplates = {
    reset: {
        /**
         * CUSTOM TEMPLATE FOR "REMOVE ALL" FILES BUTTON
         * @param {Object} data 
         * @param {Object} data.el_target_container DOM element if the file item
         * @param {String} data.id input type file id to reset
         */
        foo: function(data) {
            const current_lang = data.el_target_container.dataset.cPreviewI18n;
            data.el_target_container.insertAdjacentHTML(
                'beforeend',
                `<nav class="c-dim m-w-100">
                    <button class="
                        c-dis m-flex m-cross-center m-gap-2
                        c-dim m-p-3 m-pl-4 m-pr-4
                        c-skin m-b-0 m-brad-1 m-bc-support-danger-100 m-c-support-danger-500 m-cur-pointer" 
                        onclick="cPreview.reset('${data.id}')">
                        &times;
                        ${cPreview.getLanguageString('remove_all', current_lang) || 'Remove all'}
                    </button>
                </nav>`
            );
        },
        // MINIMAL
        // Just an example
        minimal: function(data) {
            const current_lang = data.el_target_container.dataset.cPreviewI18n;
            data.el_target_container.insertAdjacentHTML(
                'beforeend',
                `<nav>
                    <button onclick="cPreview.reset('${data.id}')">
                        &times;
                        ${cPreview.getLanguageString('remove_all', current_lang) || 'Remove all'}
                    </button>
                </nav>`
            );
        },
        /**
         * DEFAULT TEMPLATE FOR REMOVE ALL FILES BUTTON
         * @param {Object} data 
         * @param {Object} data.el_target_container DOM element if the file item
         * @param {String} data.id input type file id to reset
         */
        default: function(data) {
            const current_lang = data.el_target_container.dataset.cpreviewI18n;
            data.el_target_container.insertAdjacentHTML(
                'beforeend',
                `<nav style="width:100%"><button onclick="cPreview.reset('${data.id}')">${cPreview.getLanguageString('remove_all', current_lang) || 'Remove all'}</button></nav>`
            );
        }
    }
}
```

