const CONTRACT_ADDRESS = "0x5a04c364E7Ae04E13E897A3b981187d9DAcddEC1"

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  }
}

export { CONTRACT_ADDRESS, transformCharacterData }
