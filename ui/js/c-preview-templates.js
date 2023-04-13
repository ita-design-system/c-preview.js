// ipreview Templates
let ipreviewTemplates = {
    reset: {
        /**
         * DEFAULT TEMPLATE FOR "REMOVE ALL" FILES BUTTON
         * @param {Object} data 
         * @param {Object} data.el_target_container DOM element if the file item
         * @param {String} data.id input type file id to reset
         */
        foo: function(data) {
            if (typeof data == 'object') {
                if (typeof data.id == 'string' && typeof data.el_target_container == 'object') {
                    const current_lang = data.el_target_container.dataset.ipreviewI18n;
                    data.el_target_container.insertAdjacentHTML(
                        'beforeend',
                        `<nav class="c-dim m-w-100 ipreview-remove">
                            <span class="c-btn m-gap-3 u-c-primary-500 u-p-0" 
                                onclick="ipreview.reset('${data.id}')">
                                <span class="icon-x u-fs-8"></span> 
                                ${ipreviewTemplates.getLanguageString('remove_all', current_lang) || 'Tout retirer'}
                            </span>
                        </nav>`
                    );
                }
            }
        }
    },
    // Get optional language
    getLanguageString: function(token, current_lang) {
        let result = undefined;
        if (typeof current_lang == 'string' && typeof token == 'string') {
            if (typeof ipreviewI18n == 'object') {
                if (typeof ipreviewI18n[current_lang][token] == 'string') {
                    result = ipreviewI18n[current_lang][token];
                }
            }
        }
        return result;
    },
    file: {
        /**
         * DEFAULT TEMPLATE FOR FILE ITEM
         * @param {Object} data 
         * @param {Object} data.el_target_container DOM element if the file item
         * @param {Object} data.e Reader onload event
         * @param {Object} data.el_file File List element
         */
        foo: function(data) {
            if (typeof data == 'object') {
                if (typeof data.e == 'object' && typeof data.el_file == 'object' && typeof data.el_target_container == 'object') {
                    // Create blob
                    const blob_url = URL.createObjectURL(data.el_file);
                    // Create thumb item
                    const el_item = document.createElement('div');
                    el_item.setAttribute('class', 'c-flex m-column m-main-space-between m-g12 c-dim m-o-hidden ipreview-item');
                    el_item.setAttribute('m-w-4tg32', 'md,lg,xl');
                    el_item.setAttribute('m-maxw-300px', 'md,lg,xl');
                    el_item.setAttribute('m-w-6tg32', 'sm');
                    el_item.setAttribute('m-w-100', 'xs');
                    // Get optional current language
                    const current_lang = data.el_target_container.dataset.ipreviewI18n;
                    
                    el_item.innerHTML = `
                    <picture class="c-flex m-main-center m-cross-center c-dim m-w-100 m-o-hidden c-bg m-asset-damier"></picture>
                    <ul class="c-flex m-column c-txt m-fs-4 u-ls-none u-m-0 u-p-0 main-data">
                        <li class="c-dim m-order--1 c-flex m-main-space-between m-nowrap m-g12 u-pt-2 u-pb-2 u-bb-thin-neutral-800">
                            ${ipreviewTemplates.getLanguageString('file_name', current_lang) || 'Nom de fichier'}
                            <strong class="c-txt m-ff-lead-500 m-ta-right m-wb-break-word">
                                ${data.el_file.name}
                            </strong>
                        </li>
                        <li class="c-dim m-order--1 c-flex m-main-space-between m-nowrap m-g12 u-pt-2 u-pb-2 u-bb-thin-neutral-800">
                            ${ipreviewTemplates.getLanguageString('file_size', current_lang) || 'Taille'}
                            <strong class="c-txt m-ff-lead-500 m-ta-right m-wb-break-word">
                                ${ipreview.formatBytes(data.e.loaded, null, current_lang)}
                            </strong>
                        </li>
                        <li class="c-dim m-order--1 c-flex m-main-space-between m-nowrap m-g12 u-pt-2 u-pb-2 u-bb-thin-neutral-800">
                            ${ipreviewTemplates.getLanguageString('file_type', current_lang) || 'Format'}
                            <strong class="c-txt m-ff-lead-500 m-ta-right m-wb-break-word">
                                ${data.el_file.type}
                            </strong>
                        </li>
                        <li class="c-flex m-g12 u-pt-2 u-pb-2 u-bb-thin-neutral-800">
                            <span onclick="ipreview.remove(this, '${data.el_file.name}')"
                                class="c-txt u-c-support-danger-500 u-cur-pointer">
                                ${ipreviewTemplates.getLanguageString('remove', current_lang) || 'Supprimer'}
                            </span>
                        </li>
                    </ul>`;
                    data.el_target_container.appendChild(el_item);
                    const el_picture = el_item.querySelector('picture');
                    el_picture.innerHTML = '';
                    // If file is an image or video
                    if (data.el_file.type.indexOf('image/') == 0 || data.el_file.type.indexOf('video/') == 0) {
                        el_picture.innerHTML = `
                        <div class="u-m-6 u-p-3 u-brad-3 u-bt-thin-primary-500 u-br-thin-primary-500 u-bb-thin-primary-500"
                            style="animation: rotate 1s 0s linear infinite;"></div>`;
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
                                let image_definition_status_class = 'u-c-support-success-400';
                                let image_definition_status_icon_class = 'icon-check-circle';
                                if (image_definition < 5000000) {
                                    image_definition_status_class = 'u-c-support-warning-400';
                                    image_definition_status_icon_class = 'icon-alert-triangle';
                                }
                                el_image.classList.add('c-dim', 'm-w-100', 'm-h-auto');
                                el_image.setAttribute('alt', data.el_file.name);
                                el_picture.innerHTML = '';
                                el_picture.appendChild(el_image);
                                el_item.querySelector('.main-data').insertAdjacentHTML(
                                    'beforeend',
                                    `
                                        <li class="c-dim m-order--1 c-flex m-main-space-between m-nowrap m-g12 u-pt-2 u-pb-2 u-bb-thin-neutral-800 ${image_definition_status_class}">
                                            ${ipreviewTemplates.getLanguageString('definition', current_lang) || 'Définition'}
                                            <strong class="c-txt m-ff-lead-500 m-ta-right">
                                                <span class="${image_definition_status_icon_class}"></span>
                                                <span>${el_image.naturalWidth || el_image.videoWidth}</span> x <span>${el_image.naturalHeight || el_image.videoHeight}</span> px
                                            </strong>
                                        </li>
                                    `
                                );
                                clearInterval(loading);
                            }
                        }, 500);
                    } else {
                        el_picture.setAttribute('class', 'c-flex m-main-center m-cross-center c-dim m-w-100 m-o-hidden u-pt-6 u-pb-6 u-c-primary-500 u-bc-primary-900 u-brad-1');
                        el_picture.innerHTML = `<span class="icon-file-text u-fs-14"></span>`;
                    }
                }
            }
        }
    }
}