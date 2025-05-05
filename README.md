---
title: c-preview.js
description: Documentation de la librairie c-preview.js dédiée à l’affichage et des fichiers sélectionnés sur un input type=file
layout: libdoc_page.liquid
permalink: index.html
date: git Last Modified
---
{% include 'sandbox' path: '/sandboxes/1/index.html', title: 'Démo c-preview.js' %}

## Installation

Il est recommandé de placer les fichiers dans cet ordre avant la balise fin de body.

### En local

```html
<script src="/path/to/c-preview-i18n.js"></script> <!-- optionnel -->
<script src="/path/to/c-preview.js"></script> <!-- obligatoire --
```

### Sur CDN

Via [https://www.jsdelivr.com/](https://www.jsdelivr.com/)

```html
<!-- Version la plus récente -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js/ui/js/c-preview.js

<!-- Version la plus récente minifiée -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js/ui/js/c-preview.min.js

<!-- Typologie avec numéro de version -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@<TAG_VERSION>/ui/js/c-preview.js

<!-- Typologie numéro de version + minification automatique -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@<TAG_VERSION>/ui/js/c-preview.min.js

<!-- Exemple v0.1.0 -->
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@v0.1.0/ui/js/c-preview.js
https://cdn.jsdelivr.net/gh/ita-design-system/c-preview.js@v0.1.0/ui/js/c-preview.min.js
```

## Usage

Il suffit d'ajouter n'importe où dans le document un élément HTML avec l'attribut `data-cpreview="ID_INPUT_FILE"` **dont la valeur correspond à l'id de l"input file**.

### Usage le plus simple

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

## Méthode update

Démarre et met à jour les input type file éligibles, c'est à dire dont l'id est couplé avec un élément HTML `data-cpreview="ID_INPUT_FILE"`

```javascript
cPreview.update();
```

## Méthode getLanguageString

À partir de la clé spécifiée, retourne la chaîne de traduction. Les clés sont disponibles dans le fichier optionnel `c-preview-i18n.js`.

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

## Méthode reset

Retire tous les fichiers de l'input type file spécifié

```javascript
/**
 * RESET METHOD
 * Remove all files from the specified input type file
 * @param {String} input_id token name of the translation string
 */
cPreview.reset(input_id);
```
