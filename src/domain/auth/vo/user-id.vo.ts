//
// export class UserId {
//   constructor(private readonly id: number) {
//     this.validate(id);
//   }
//
//   get value(): number {
//     return this.id;
//   }
//
//   private validate(id: string): void {
//     if (id.length === 0) {
//       throw new Error('User ID cannot be empty');
//     }
//     if (id.length > 50) {
//       throw new Error('User ID cannot be longer than 50 characters');
//     }
//   }
//
//   equals(other: UserId): boolean {
//     return this.id === other.id;
//   }
// }
