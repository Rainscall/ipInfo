"use strict"
const apiEndpoint = 'https://ip-backend.typeboom.com';
let userIP = '';
let isNativeIP = 'Unknown';

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

    if (!IPInfo) {
        IPInfo = await fetch(apiEndpoint).then(r => r.json());
    }

    userIP = IPInfo.clientIP;

    try {
        if (IPInfo.Location.country.iso_code && IPInfo.Location.registered_country.iso_code) {
            if (IPInfo.Location.country.iso_code === IPInfo.Location.registered_country.iso_code) {
                isNativeIP = 'True';
            } else {
                isNativeIP = 'False';
            }
        }
    } catch {
        isNativeIP = 'Unknown';
    }

    const fakeInfoList = ['IP', 'ASN', 'IP Organization', 'location', 'naive IP', 'raw data', 'search']
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
        switch (currentKey) {
            case 'ASN': {
                base.addEventListener('click', () => {
                    window.open(`https://www.peeringdb.com/search/v2?q=AS${value.dataset.value}`)
                });
            }
            default: {
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
                        clearInterval(Interval);
                    }, 350)
                })
            }
        }

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
        title.classList.add('bold');
        title.innerText = 'native IP';
        value.innerHTML = isNativeIP;

        base.appendChild(title);
        base.appendChild(value);
        ipInfoArea.appendChild(base);
        ipInfoArea.appendChild(document.createElement('hr'));
    })();

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
            window.open(`${apiEndpoint}/search/${userIP}`, '_blank')
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

        input.placeholder = 'IPv4/IPv6/FQDN';
        input.required = 'required';

        base.addEventListener('click', () => {
            input.focus();
        });

        form.onsubmit = (e) => {
            e.preventDefault();
            if (!input.value) {
                return;
            }
            let addr = input.value.trim();
            if (!isValidIP(addr) && !isValidDomain(addr)) {
                if ((addr.startsWith('http://') || addr.startsWith('https://')) && addr.includes('.')) {
                    addr = addr.split('/')[2].split(':')[0];
                } else {
                    createToast('Invalid IP');
                    return;
                }
            }
            createToast('Loading...', -1, '#FFF', '#414141', 'temp-search-loadingToast');

            getIPInfo(addr)
                .then(r => {
                    if (r == 'NXDOMAIN') {
                        createToast('No A/AAAA record found for this domain.', 4300, '#FFF', '#840D23');
                        input.value = '';
                    }
                })
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
    removeElementsByClassName('temp-search-loadingToast', 500);
    if (r.status === 'NXDOMAIN') {
        return 'NXDOMAIN';
    }
    writeInfo(r);
}

async function removeElementsByClassName(className, delay = 0) {
    setTimeout(() => {
        let ele = document.getElementsByClassName(className);
        for (let i = 0; i < ele.length; i++) {
            ele[i].parentNode.removeChild(ele[i]);
        }
    }, delay);
}

function isValidIP(ip) {
    function isValidIPv4(ip) {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4Regex.test(ip);
    }
    function isValidIPv6(ip) {
        const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        return ipv6Regex.test(ip);
    }
    return isValidIPv4(ip) || isValidIPv6(ip);
}

function isValidDomain(str) {
    const domainRegex = /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return domainRegex.test(str);
}

function createToast(info, time = 4300, color = '#FFF', bgColor = '#414141', exClassName) {
    if (!info) {
        return;
    }
    Toastify({
        text: info,
        duration: time,
        className: `info ${exClassName}`,
        position: "center",
        gravity: "top",
        style: {
            color: color,
            background: bgColor,
            borderRadius: "8px",
            wordWrap: "break-word",
            width: "fit-content",
            maxWidth: "80vw",
            boxShadow: "0 3px 6px -1px rgba(0, 0, 0, 0.217), 0 10px 36px -4px rgba(98, 98, 98, 0.171)"
        }
    }).showToast();
}