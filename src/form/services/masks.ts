export class Masks {
    static onlyNumbers(character: string): string {
        if (character.match(/[0-9]/)) {
            return character
        }
        return ""
    }
}
