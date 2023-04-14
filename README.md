# c-preview.js
Librairie JS dédiée à l'affichage et des fichiers sélectionnés sur un input type="file"

[Démo](https://ita-design-system.github.io/c-preview.js/)

## Installation

Il est recommandé de placer les fichiers dans cet ordre avant la balise fin de body.

### En local

```html
<body>
    <script src="/path/to/c-preview-templates.js"></script> <!-- optionnel -->
    <script src="/path/to/c-preview.js"></script> <!-- obligatoire -->
</body>
```

### Sur CDN

via [https://www.jsdelivr.com/](https://www.jsdelivr.com/)

```html
<!-- Version la plus récente -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js/ui/js/c-preview.js

<!-- Typologie avec numéro de version -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@<TAG_VERSION>/ui/js/c-preview.js

<!-- Typologie numéro de version + minification automatique -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@<TAG_VERSION>/ui/js/c-preview.min.js
```

```html
<body>
    <!-- Exemple avec version la plus récente -->
    <script src="https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js/ui/js/c-preview-templates.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js/ui/js/c-preview.min.js"></script>

    <!-- Exemple avec numéro de version -->
    <script src="https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@v0.2.0/ui/js/c-preview-templates.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@v0.2.0/ui/js/c-preview.min.js"></script>
</body>
```

## Usage

Il suffit d'ajouter n'importe où dans le document un élément HTML avec l'attribut `data-cpreview="ID_INPUT_FILE"` **dont la valeur correspond à l'id de l"input file**.

### Le plus simple

Exemple d'usage le plus simple, cPreview peut gérer plusieurs instances.

```html
<input type="file" id="first" multiple>
<div data-cpreview="first"></div>

<input type="file" id="second">
<div data-cpreview="second"></div>
```

### Langue personnalisée

Exemple avec langue personnalisée pour l'interface

```html
<input type="file" id="first" multiple>
<div data-cpreview="first" data-cpreview-i18n="fr"></div>
```

Quand l'attribut `data-cpreview-i18n="TOKEN_LANGUAGE"` est renseigné, cPreview invoque `cPreviewI18n[TOKEN_LANGUAGE][TOKEN_STRING]` pour en obtenir la chaine de caractères de la langue spécifiée. Si elle n'existe pas, la valeur par défaut (anglais) est affichée.

Pour ajouter les traductions, ajouter un object JS nommé `cPreviewI18n` contenant les tokens des chaines de caractères suivants:

```javascript
// Objet langues optionnel
const cPreviewI18n = {
    fr: {
        file_name: "Nom du fichier",
        file_size: "Taille du fichier",
        file_type: "Type de fichier",
        remove: "Retirer",
        remove_all: "Tout retirer",
        definition: "Définition Lxh en pixels",
        bytes_0: "Octets", 
        bytes_1: "Ko", 
        bytes_2: "Mo", 
        bytes_3: "Go", 
        bytes_4: "To", 
        bytes_5: "Po", 
        bytes_6: "Eo", 
        bytes_7: "Zo", 
        bytes_8: "Yo"
    },
    en: {
        file_name: "File name",
        file_size: "File size",
        file_type: "File type",
        remove: "Remove",
        remove_all: "Remove all",
        definition: "Definition WxH in pixels",
        bytes_0: "Bytes",
        bytes_1: "KB",
        bytes_2: "MB",
        bytes_3: "GB",
        bytes_4: "TB",
        bytes_5: "PB",
        bytes_6: "EB",
        bytes_7: "ZB",
        bytes_8: "YB"
    }
}
```

### Template reset personnalisé

Exemple avec un template personnalisé de retrait de tous les fichiers. Si le template est invalide ou n'existe pas, le template par défaut est utilisé.

```html
<label for="first">Template reset nommé "foo"</label>
<input type="file" id="first" multiple>
<div data-cpreview="first" data-cpreview-template-reset="foo"></div>
<hr>
<label for="second">Template reset nommé "minimal"</label>
<input type="file" id="second" multiple>
<div data-cpreview="second" data-cpreview-template-reset="minimal"></div>
```

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

### Template fichier personnalisé

Personnalisation de la présentation de la sélection des fichiers. Si le template est invalide ou n'existe pas, le template par défaut est utilisé.

```html
<label for="first">Template fichier nommé "foo"</label>
<input type="file" id="first" multiple>
<div    data-cpreview="first"
        data-cpreview-template-file="foo"
        class="c-dis m-flex m-gap-3 m-wrap"></div>
```

Quand l'attribut `data-cpreview-template-file="TOKEN_TEMPLATE_FILE"` est renseigné, cPreview invoque `cPreviewTemplates[TOKEN_TEMPLATE_FILE]` et l'utilise pour générer le HTML du template fichiers sélectionnés.

Pour ajouter un template de fichiers, ajouter une méthode dans l'objet `cPreviewTemplates.file[TOKEN_NOM_DU NOUVEAU_TEMPLATE]`, sur la base de l'exemple suivant:

```javascript
// cPreview Templates optionnels
let cPreviewTemplates = {
    file: {
        /**
         * CUSTOM TEMPLATE FOR FILE ITEM
         * @param {Object} data 
         * @param {Object} data.el_target_container DOM element if the file item
         * @param {Object} data.e Reader onload event
         * @param {Object} data.el_file File List element
         */
        foo: function(data) {
            // Create blob
            const blob_url = URL.createObjectURL(data.el_file);
            // Create thumb item
            const el_item = document.createElement('div');
            el_item.setAttribute('class', 'c-dis m-flex m-column m-main-space-between m-gap-3 c-dim m-o-hidden');
            el_item.setAttribute('m-w-4t', 'md,lg,xl');
            el_item.setAttribute('m-w-6t', 'sm');
            el_item.setAttribute('m-w-100', 'xs');
            // Get optional current language
            const current_lang = data.el_target_container.dataset.cpreviewI18n;
            
            el_item.innerHTML = `
            <picture class="
                c-dis m-flex m-main-center m-cross-center
                c-dim m-w-100 m-o-hidden"></picture>
            <ul class="
                c-dis m-flex m-column
                c-dim m-m-0 m-p-0
                c-txt m-fs-4
                c-skin m-ls-none main-data">
                <li class="
                    c-dis m-flex m-main-space-between m-gap-3
                    c-dim m-order--1">
                    ${cPreview.getLanguageString('file_name', current_lang) || 'File name'}
                    <strong class="c-txt m-ff-lead-500 m-ta-right m-wb-break-word">
                        ${data.el_file.name}
                    </strong>
                </li>
                <li class="
                    c-dis m-flex m-main-space-between m-gap-3
                    c-dim m-order--1">
                    ${cPreview.getLanguageString('file_size', current_lang) || 'File size'}
                    <strong class="c-txt m-ff-lead-500 m-ta-right m-wb-break-word">
                        ${cPreview.formatBytes(data.e.loaded, null, current_lang)}
                    </strong>
                </li>
                <li class="
                    c-dis m-flex m-main-space-between m-gap-3
                    c-dim m-order--1">
                    ${cPreview.getLanguageString('file_type', current_lang) || 'File type'}
                    <strong class="c-txt m-ff-lead-500 m-ta-right m-wb-break-word">
                        ${data.el_file.type}
                    </strong>
                </li>
                <li class="c-dis m-flex m-main-space-between m-gap-3">
                    <span onclick="cPreview.remove(this, '${data.el_file.name}')"
                        class="c-skin m-c-support-danger-500 m-cur-pointer">
                        ${cPreview.getLanguageString('remove', current_lang) || 'Remove'}
                    </span>
                </li>
            </ul>`;
            data.el_target_container.appendChild(el_item);
            const el_picture = el_item.querySelector('picture');
            el_picture.innerHTML = '';
            // If file is an image or video
            if (data.el_file.type.indexOf('image/') == 0 || data.el_file.type.indexOf('video/') == 0) {
                el_picture.innerHTML = `
                <div class="
                    c-dim m-order--1 m-m-6 m-p-3
                    c-skin m-brad-3"></div>`;
                // Create thumb image item
                let el_image = document.createElement('img');
                if (data.el_file.type.indexOf('video/') == 0) {
                    el_image = document.createElement('video');
                    el_image.setAttribute('controls', 'true')
                }
                // el_image.src = data.e.target.result;
                el_image.src = blob_url;
                const loading = setInterval(() => {
                    // console.log('attempt', data.el_file.name);
                    if ((el_image.naturalWidth > 0 && el_image.naturalHeight > 0) || data.el_file.type == 'image/svg+xml' || data.el_file.type.indexOf('video/') == 0) {

                        const image_definition = el_image.naturalWidth * el_image.naturalHeight;
                        let image_definition_status_class = 'c-skin m-c-support-success-400';
                        if (image_definition < 5000000) {
                            image_definition_status_class = 'u-c-support-warning-400';
                        }
                        el_image.classList.add('c-dim', 'm-w-100', 'm-h-auto');
                        el_image.setAttribute('alt', data.el_file.name);
                        el_picture.innerHTML = '';
                        el_picture.appendChild(el_image);
                        el_item.querySelector('.main-data').insertAdjacentHTML(
                            'beforeend',
                            `
                                <li class="
                                    c-dis m-flex m-main-space-between m-gap-3
                                    c-dim m-order--1
                                    ${image_definition_status_class}">
                                    ${cPreview.getLanguageString('definition', current_lang) || 'Definition'}
                                    <strong class="c-txt m-ff-lead-500 m-ta-right">
                                        <span>${el_image.naturalWidth || el_image.videoWidth}</span> x <span>${el_image.naturalHeight || el_image.videoHeight}</span> px
                                    </strong>
                                </li>
                            `
                        );
                        clearInterval(loading);
                    }
                }, 500);
            } else {
                if (data.el_file.type == 'application/pdf' || data.el_file.type == 'text/html' || data.el_file.type == 'text/plain') {
                    el_picture.setAttribute('class', 'c-dis m-flex m-main-center m-cross-center c-dim m-w-100 m-o-hidden c-skin m-c-primary-500 m-bc-primary-100 m-brad-1');
                    el_picture.innerHTML = `<iframe src="${blob_url}" class="c-dim m-w-100 c-skin m-b-0" height="200"></iframe>`;
                } else {
                    el_picture.setAttribute('class', 'c-dis m-flex m-main-center m-cross-center c-dim m-w-100 m-o-hidden m-pt-6 m-pb-6 c-skin m-c-primary-500 m-bc-primary-100 m-brad-1');
                    el_picture.innerHTML = `<span class="c-txt m-fs-10">↥</span>`;
                }
            }
        },
        /**
         * DEFAULT TEMPLATE FOR FILE ITEM
         * @param {Object} data 
         * @param {Object} data.el_target_container DOM element if the file item
         * @param {Object} data.e Reader onload event
         * @param {Object} data.el_file File List element
         */
        default: function(data) {
            // Create thumb item
            const el_item = document.createElement('div');
            const current_lang = data.el_target_container.dataset.cpreviewI18n;
            el_item.innerHTML = `
            <ul>
                <li>${cPreview.getLanguageString('file_name', current_lang) || 'File name'}: ${data.el_file.name}</li>
                <li>${cPreview.getLanguageString('file_size', current_lang) || 'File size'}: ${cPreview.formatBytes(data.e.loaded, current_lang)}</li>
                <li>${cPreview.getLanguageString('file_type', current_lang) || 'File type'}: ${data.el_file.type}</li>
                <li>
                    <button onclick="cPreview.remove(this, '${data.el_file.name}')">
                        ${cPreview.getLanguageString('remove', current_lang) || 'Remove'}
                    </button>
                </li>
            </ul>`;
            // Insert file markup
            data.el_target_container.appendChild(el_item);
        }
    }
}
```

## Méthodes

### `update()`

Démarre et met à jour les input type file éligibles, c'est à dire dont l'id est couplé avec un élément HTML `data-cpreview="ID_INPUT_FILE"`

```javascript
cPreview.update();
```

### `getLanguageString(token, current_lang)`

Retourne la chaîne de traduction spécifiée.

```javascript
/**
 * OPTIONAL LANGUAGE STRING METHOD
 * @param {String} token token name of the translation string
 * @param {String} current_lang language invoked 
 * @return {String} for a valid token + language or {undefined} is not
 */
cPreview.getLanguageString(token, current_lang);

// Ex.
cPreview.getLanguageString('file_name', 'fr'); // "Nom du fichier"
cPreview.getLanguageString('file_name', 'en'); // "File name"
```

Liste des tokens langues:

```javascript
// Optional i18n for c-preview.js
const cPreviewI18n = {
    fr: {
        file_name: "Nom du fichier",
        file_size: "Taille du fichier",
        file_type: "Type de fichier",
        remove: "Retirer",
        remove_all: "Tout retirer",
        definition: "Définition Lxh en pixels",
        bytes_0: "Octets", 
        bytes_1: "Ko", 
        bytes_2: "Mo", 
        bytes_3: "Go", 
        bytes_4: "To", 
        bytes_5: "Po", 
        bytes_6: "Eo", 
        bytes_7: "Zo", 
        bytes_8: "Yo"
    },
    en: {
        file_name: "File name",
        file_size: "File size",
        file_type: "File type",
        remove: "Remove",
        remove_all: "Remove all",
        definition: "Definition WxH in pixels",
        bytes_0: "Bytes",
        bytes_1: "KB",
        bytes_2: "MB",
        bytes_3: "GB",
        bytes_4: "TB",
        bytes_5: "PB",
        bytes_6: "EB",
        bytes_7: "ZB",
        bytes_8: "YB"
    }
}
```

### `reset(input_id)`

Retire tous les fichiers de l'input type file spécifié

```javascript
/**
 * RESET METHOD
 * Remove all files from the specified input type file
 * @param {String} input_id token name of the translation string
 */
cPreview.reset(input_id);
```
