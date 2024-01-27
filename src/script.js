"use strict"
const apiEndpoint = 'https://ip-backend.typeboom.com';

window.onload = () => {
    writeInfo();
}

async function writeInfo() {
    const ipInfoArea = document.getElementById('ipInfoArea');
    const infoList = {
        'clientIP': 'clientIP',
        'ASN': 'ASN.autonomous_system_number',
        'IP Organization': 'ASN.autonomous_system_organization',
        'location': 'Location.country.names.en'
    }
    for (let i = 0; i < Object.keys(infoList).length; i++) {
        const currentKey = Object.keys(infoList)[i];
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
        if (i != Object.keys(infoList).length - 1) {
            ipInfoArea.appendChild(document.createElement('hr'));
        }
    }
    const IPInfo = await fetch(apiEndpoint).then(r => r.json());
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
            ptrCache = ptrCache[ptr[i]];
        }

        value.innerText = ptrCache;
        value.dataset.value = ptrCache;
        value.addEventListener('click', (e) => {
            e.target.innerText = 'Copied';
            const textArea = document.createElement('textArea')
            textArea.value = e.target.dataset.value;
            textArea.style.width = 0
            textArea.style.position = 'fixed'
            textArea.style.left = '-999px'
            textArea.style.top = '10px'
            textArea.setAttribute('readonly', 'readonly')
            document.body.appendChild(textArea)

            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setInterval(() => {
                e.target.innerText = e.target.dataset.value;
            }, 350)
        })

        base.appendChild(title);
        base.appendChild(value);
        ipInfoArea.appendChild(base);
        if (i != Object.keys(infoList).length - 1) {
            ipInfoArea.appendChild(document.createElement('hr'));
        }
    }
}