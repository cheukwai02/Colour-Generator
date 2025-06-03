document.addEventListener('DOMContentLoaded', () => {
    const paletteContainer = document.getElementById('palette-container');
    const generateBtn = document.getElementById('generate-btn');
    const toneBlocks = document.querySelectorAll('.tone-block');
    
    let selectedTones = [];

    // Add click event listeners to tone blocks (multi-select)
    toneBlocks.forEach(block => {
        block.addEventListener('click', () => {
            const tone = block.dataset.tone;
            if (block.classList.contains('active')) {
                block.classList.remove('active');
                selectedTones = selectedTones.filter(t => t !== tone);
            } else {
                block.classList.add('active');
                selectedTones.push(tone);
            }
            generatePalette();
        });
    });

    // Generate initial palette
    generatePalette();

    // Add event listener to the generate button
    generateBtn.addEventListener('click', () => {
        generateBtn.classList.add('scale-95');
        setTimeout(() => generateBtn.classList.remove('scale-95'), 150);
        paletteContainer.innerHTML = '';
        generatePalette();
        playSound();
    });

    /**
     * Generates a color palette based on the selected tones
     */
    function generatePalette() {
        paletteContainer.innerHTML = '';
        const paletteSize = 5;
        if (selectedTones.length === 1) {
            for (let i = 0; i < paletteSize; i++) {
                const hexColor = generateColorInTone(selectedTones[0]);
                createColorBlock(hexColor, i);
            }
        } else if (selectedTones.length > 1) {
            // Generate a smooth gradient across all selected tones
            const gradientColors = generateGradientColors(selectedTones, paletteSize);
            for (let i = 0; i < paletteSize; i++) {
                createColorBlock(gradientColors[i], i);
            }
        } else {
            for (let i = 0; i < paletteSize; i++) {
                const hexColor = generateRandomColor();
                createColorBlock(hexColor, i);
            }
        }
    }

    /**
     * Generates a color within a specific tone
     */
    function generateColorInTone(tone) {
        const toneColors = {
            red: { r: 255, g: 0, b: 0 },
            orange: { r: 255, g: 165, b: 0 },
            yellow: { r: 255, g: 255, b: 0 },
            green: { r: 0, g: 255, b: 0 },
            blue: { r: 0, g: 0, b: 255 },
            purple: { r: 128, g: 0, b: 128 },
            pink: { r: 255, g: 192, b: 203 }
        };
        const baseColor = toneColors[tone];
        const variation = 50;
        const r = Math.max(0, Math.min(255, baseColor.r + (Math.random() * variation * 2 - variation)));
        const g = Math.max(0, Math.min(255, baseColor.g + (Math.random() * variation * 2 - variation)));
        const b = Math.max(0, Math.min(255, baseColor.b + (Math.random() * variation * 2 - variation)));
        return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`.toUpperCase();
    }

    /**
     * Generates a smooth gradient of colors across all selected tones
     * @param {string[]} tones - Array of selected tone names
     * @param {number} steps - Number of colors to generate
     * @returns {string[]} - Array of HEX color codes
     */
    function generateGradientColors(tones, steps) {
        const toneColors = {
            red: { r: 255, g: 0, b: 0 },
            orange: { r: 255, g: 165, b: 0 },
            yellow: { r: 255, g: 255, b: 0 },
            green: { r: 0, g: 255, b: 0 },
            blue: { r: 0, g: 0, b: 255 },
            purple: { r: 128, g: 0, b: 128 },
            pink: { r: 255, g: 192, b: 203 }
        };
        const baseColors = tones.map(tone => toneColors[tone]);
        if (steps <= 1 || baseColors.length === 1) {
            return [rgbToHex(baseColors[0])];
        }
        // For 2 tones, interpolate directly between them
        if (baseColors.length === 2) {
            const colors = [];
            for (let i = 0; i < steps; i++) {
                const t = i / (steps - 1);
                const color1 = baseColors[0];
                const color2 = baseColors[1];
                const r = Math.round(color1.r * (1 - t) + color2.r * t);
                const g = Math.round(color1.g * (1 - t) + color2.g * t);
                const b = Math.round(color1.b * (1 - t) + color2.b * t);
                // Add a small random variation for natural look
                const variation = 20;
                const rv = Math.max(0, Math.min(255, r + (Math.random() * variation * 2 - variation)));
                const gv = Math.max(0, Math.min(255, g + (Math.random() * variation * 2 - variation)));
                const bv = Math.max(0, Math.min(255, b + (Math.random() * variation * 2 - variation)));
                colors.push(rgbToHex({ r: rv, g: gv, b: bv }));
            }
            return colors;
        }
        // For more than 2 tones, interpolate through all
        const segments = baseColors.length - 1;
        const colors = [];
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const seg = Math.floor(t * segments);
            const segT = (t - seg / segments) * segments;
            const color1 = baseColors[seg];
            const color2 = baseColors[seg + 1];
            const r = Math.round(color1.r * (1 - segT) + color2.r * segT);
            const g = Math.round(color1.g * (1 - segT) + color2.g * segT);
            const b = Math.round(color1.b * (1 - segT) + color2.b * segT);
            const variation = 20;
            const rv = Math.max(0, Math.min(255, r + (Math.random() * variation * 2 - variation)));
            const gv = Math.max(0, Math.min(255, g + (Math.random() * variation * 2 - variation)));
            const bv = Math.max(0, Math.min(255, b + (Math.random() * variation * 2 - variation)));
            colors.push(rgbToHex({ r: rv, g: gv, b: bv }));
        }
        return colors;
    }

    function rgbToHex({ r, g, b }) {
        return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`.toUpperCase();
    }

    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    }

    function createColorBlock(hexColor, index) {
        const colorBlock = document.createElement('div');
        colorBlock.className = 'color-block rounded-lg h-48 flex flex-col justify-end p-4 cursor-pointer shadow-md';
        colorBlock.style.backgroundColor = hexColor;
        colorBlock.style.animationDelay = `${index * 0.1}s`;
        const isLight = isLightColor(hexColor);
        const textColor = isLight ? 'text-gray-800' : 'text-white';
        const colorCode = document.createElement('div');
        colorCode.className = `${textColor} font-medium text-lg tracking-wide transition-all`;
        colorCode.textContent = hexColor;
        colorBlock.appendChild(colorCode);
        colorBlock.addEventListener('click', () => {
            copyToClipboard(hexColor, colorBlock);
        });
        paletteContainer.appendChild(colorBlock);
    }

    function isLightColor(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128;
    }

    function copyToClipboard(colorCode, element) {
        navigator.clipboard.writeText(colorCode)
            .then(() => {
                const copiedMsg = document.createElement('div');
                copiedMsg.className = 'copied-message absolute text-white bg-gray-800 bg-opacity-75 px-3 py-1 rounded text-sm';
                copiedMsg.textContent = 'Copied!';
                copiedMsg.style.top = '50%';
                copiedMsg.style.left = '50%';
                copiedMsg.style.transform = 'translate(-50%, -50%)';
                element.style.position = 'relative';
                element.appendChild(copiedMsg);
                playSound('copy');
                setTimeout(() => {
                    copiedMsg.remove();
                }, 1500);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }
    
    function playSound(type = 'generate') {
        try {
            const sound = new Audio();
            sound.volume = 0.2;
            if (type === 'copy') {
                sound.src = 'data:audio/mp3;base64,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';
            } else {
                sound.src = 'data:audio/mp3;base64,SUQzAwAAAAABdFRSQ0sAAAADAAADTGF2ZjU4LjEyLjEwMABUWVhYAAAABQAAAFRvZGF5AEVuYyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NAAAAAABR8wAHMAwD/FDSGHkADAAJLlJqAC1U8+AACiJEDPRCyA6Bk1wBQoD+BAHKAABWXLVGCAOYGJAJoATuBDACABLgAR4BDEA9CAC1Bn0B4wDTLn/0AmUBK4A7AABMgEVBYBTgOgZYBcADLAVIsAAD//PyDh/8K0BJMfKLqH/zGwFjpH+lfxXi//4BAGlr+l/wUF/8BUD//+KUL/+BkK//8+VL/4k///wMA//MUZAgDhEkOVoKAAhbhpioQQQBDFDBAAIAYhAIAPy4AFoMfgAIgz+NigAUAL8ACoMfmA7IBDswAPAA2AEaQCDAFPkAfwAXfwQGABuYBm5AAsMXDABQMwI4BuJCACgMPD/o2ATA9/5cYAkGP/5cBAUA//3YB//6MBn//ygP//9AK//+fA///oAF//8QF//MUZAYD3Dk21oGIAgz5knPNGxBCg//AoP//4gO//ygZ//KFf//6CJQOXEEMQEgwAwLGMgCBAAsMAYwu/wKAMABKI8FAAD/+sIRgMcMAUAJUQABCoAGAAYYWBQAHA5f+WQMIA/+A8wBH/xMAM//1Aif//yCf//wBv//IA///MAnf/zAH//8wChf/KAH//3gK//MUZAADuDMiR4EIAZdZqiANGxBDFAXP//HQVf//AFJAACQAgQVaQBCEAUQMBIBCTAHAK+ABeRDQJDDKRjKQAAAYSBogIKCkzA4BxEwAQAJABG5AJAH4QHEAH/g+AQDAwlgE+gn/cUgA//HQRL//KBjv/0gL//9QCd//IA///SBM//wBP//oAnf/yAP//0AL//MUZAIDuDcYxoIIAgcZhjHJEAAP/8wCO//oBmJVVmZmfTAAAhAEcmMDQGMBAMFwJMvCySTH/xAgCDAFFBQAGgIYiBsEGJgB4iJAPwGDQFJgBgAxgHgBj/8dFABCYA8h//0jADf/+IAL//qAL//6Ab//wA9//gBP//YA1//IAf//UA///oB//MUZAQDwDcYBgCIAZFZqiANENADn//QBG//UAz//UA///oEEBQ2NQmDgYBgcIxXl3nKGZzs6EMTM1DvIAEpsCAbMAAXBQAHIASQC7QBgQXxgJgAhgHQAhiEH/80AAOgAH//4QC5//iAPP/8gDn//IA3f/qAP//+QKAASYCqALYA///OAV//KAL//0Af//6AL//MUZAIDyD0cZQTIAQ55fhmAQ0AP//YA7//UA3//9Aj//+HWqqqmpQCEiU8bHgRACMAh8YzEU3U3FmhsbHRwY4aKgiOwCBBQA1MA6ArFgCyCDAwIzAXCBQYAj/4cA8n//EB2v/2ALv/7ADn//IAyf/8gDP//QBZ//QA///qAf//4A///oAP//UAb//MkZAgDxCUOBgRIAYvQnhvGCYAP+gD//7AH//8QEEA5hkBDCsLvGLMxKdDggMCwwDA8I/FoQCBQwPBuiBEMCgn/wg4wFBkTkWQaA0zAdMB0ACUBP4TP5gbgAkYCIAOMAoMBYP/7AQ0YARALNEBIGIBIoA5gADNBU//ZAJf//GBD//CCP//IDH//IAHP/6AK//6AIrBZ//1AQ//oA///YA///xAf//UAV//1AH//MUZAIDpDkYBwDIAZFpmhWHGwAP2ATv/5AJ//8gGMGjQDgBkIYwiJYNbGGQZAhQmXpzEGJjAcACkA2IBWCgAE1ACMZAHD/wIBYYBb/47A8H//QBZ//YA3//YA5//yAOP/8gDN//IAu//UAT//1AGP/6gF//+AB3/3APgZWDPrUDo//MUZAEDcCEOVoSAAQ/Q1hAAEMAABKAK//zAH//2BQDu8ZDQBkPCJEJBIjBAIzRObNTUxZyMWACDAoTBoDQABGADmATQAtgRGEDAwV4wDgIw5/7UAcv/7AFz//IA9//yAOf/8gDj//IA0//0AM//6ALf/9QBd//IAv//sAV//yAVnZ2RkTEFNRTMuOTkuNXVV//MUZA4DnC8QwASAAQ4YSiAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
            }
            sound.play().catch(e => {
                console.log('Sound play prevented by browser policy', e);
            });
        } catch (e) {
            console.log('Sound play error', e);
        }
    }
}); 