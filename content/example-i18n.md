---
title: Langues
description: Exemple avec langue personnalisée
layout: libdoc/page-split
category: Exemples
order: 20
---

```html
<input type="file" id="first" multiple>
<div data-cpreview="first"
    data-cpreview-i18n="fr"></div>
```
{:.playground title="Exemple avec langue personnalisée"}

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

