"use strict"
const apiEndpoint = 'https://ip-backend.typeboom.com';

window.onload = () => {
    writeInfo();
}

async function writeInfo(IPInfo) {
    const ipInfoArea = document.getElementById('ipInfoArea');
    const infoList = {
        'IP': 'clientIP',
        'ASN': 'ASN.autonomous_system_number',
        'IP Organization': 'ASN.autonomous_system_organization',
        'location': 'Location.country.names.en'
    }
    const fakeInfoList = ['IP', 'ASN', 'IP Organization', 'location', 'raw data', 'search']
    for (let i = 0; i < fakeInfoList.length; i++) {
        const currentKey = fakeInfoList[i];
        let base = document.createElement('div');
        let title = document.createElement('div');
        let value = document.createElement('div');

        base.classList.add('childPart');

        title.innerText = currentKey;
        title.classList.add('bold');

        value.innerText = 'Loading';

        base.appendChild(title);
        base.appendChild(value);
        ipInfoArea.appendChild(base);
        if (i < fakeInfoList.length - 1) {
            ipInfoArea.appendChild(document.createElement('hr'));
        }
    }
    if (!IPInfo) {
        IPInfo = await fetch(apiEndpoint).then(r => r.json());
    }
    ipInfoArea.innerHTML = '';

    for (let i = 0; i < Object.keys(infoList).length; i++) {
        const currentKey = Object.keys(infoList)[i];
        let base = document.createElement('div');
        let title = document.createElement('div');
        let value = document.createElement('div');

        base.classList.add('childPart');

        title.innerText = currentKey;
        title.classList.add('bold');

        const ptr = infoList[currentKey].split('.');
        let ptrCache = IPInfo;
        for (let i = 0; i < ptr.length; i++) {
            if (ptrCache[ptr[i]]) {
                ptrCache = ptrCache[ptr[i]];
            } else {
                continue;
            }
        }

        if (typeof ptrCache == 'object') {
            continue;
        }

        value.innerText = ptrCache;
        value.dataset.value = ptrCache;
        base.addEventListener('click', () => {
            value.innerText = 'Copied';
            const textArea = document.createElement('textArea')
            textArea.value = value.dataset.value;
            textArea.style.width = 0
            textArea.style.position = 'fixed'
            textArea.style.left = '-999px'
            textArea.style.top = '10px'
            textArea.setAttribute('readonly', 'readonly')
            document.body.appendChild(textArea)

            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            let Interval = setInterval(() => {
                value.innerText = value.dataset.value;
                console.log('123');
                clearInterval(Interval);
            }, 350)
        })

        base.appendChild(title);
        base.appendChild(value);
        ipInfoArea.appendChild(base);
        ipInfoArea.appendChild(document.createElement('hr'));
    }
    (() => {
        let base = document.createElement('div');
        let title = document.createElement('div');
        let value = document.createElement('div');
        base.classList.add('childPart');
        value.classList.add('inlineSvgIcon');
        title.classList.add('bold');
        title.innerText = 'raw data';
        value.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>'

        base.addEventListener('click', () => {
            window.open(apiEndpoint, '_blank')
        })

        base.appendChild(title);
        base.appendChild(value);
        ipInfoArea.appendChild(base);
        ipInfoArea.appendChild(document.createElement('hr'));
    })();

    (() => {
        let base = document.createElement('div');
        let title = document.createElement('div');
        let value = document.createElement('div');
        let form = document.createElement('form');
        let input = document.createElement('input');
        base.classList.add('childPart');
        base.style.cursor = 'text';
        title.classList.add('bold');
        title.innerText = 'search';

        input.placeholder = 'IPv4/IPv6';

        base.addEventListener('click', () => {
            input.focus();
        });

        form.onsubmit = (e) => {
            e.preventDefault();
            if (!input.value) {
                return;
            }
            getIPInfo(input.value);
        }

        form.appendChild(input);
        value.appendChild(form);
        base.appendChild(title);
        base.appendChild(value);
        ipInfoArea.appendChild(base);
    })();
}

async function getIPInfo(ip = '1.1.1.1') {
    const r = await fetch(`${apiEndpoint}/search/${ip}`).then(r => r.json());
    writeInfo(r);
}