const CONTRACT_ADDRESS = "0x26a0146C451e29045202Ad76C33eDB448827FBFa";

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
    };
};

export {CONTRACT_ADDRESS, transformCharacterData};