// cpreview Templates
let cPreviewTemplates = {
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
                    const current_lang = data.el_target_container.dataset.cPreviewI18n;
                    data.el_target_container.insertAdjacentHTML(
                        'beforeend',
                        `<nav class="c-dim m-w-100 cpreview-remove">
                            <span class="
                                c-dis m-flex m-cross-center m-gap-2
                                c-skin m-c-support-danger-500 m-cur-pointer" 
                                onclick="cPreview.reset('${data.id}')">
                                &times;
                                ${cPreview.getLanguageString('remove_all', current_lang) || 'Remove all'}
                            </span>
                        </nav>`
                    );
                }
            }
        }
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
                    el_item.setAttribute('class', 'c-dis m-flex m-column m-main-space-between m-gap-3 c-dim m-o-hidden cpreview-item');
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
                }
            }
        }
    }
}