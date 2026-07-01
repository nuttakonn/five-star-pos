import { googleSheetsService, GoogleSheetsService } from '../services/google-sheets.service';
import { ApiError } from '../errors/api.error';

export abstract class BaseSheetsRepository<T extends Record<string, any>> {
  protected sheetsService: GoogleSheetsService = googleSheetsService;
  protected abstract sheetName: string;
  protected abstract columns: (keyof T)[];

  protected async getRows(): Promise<T[]> {
    const rawRows = await this.sheetsService.getAllRows(`${this.sheetName}!A2:Z`);
    return rawRows.map(row => this.mapRowToObject(row));
  }

  protected async append(item: T): Promise<void> {
    const row = this.mapObjectToRow(item);
    await this.sheetsService.appendRow(`${this.sheetName}!A:A`, row);
  }

  protected async find(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getRows();
    return items.filter(predicate);
  }

  protected mapRowToObject(row: any[]): T {
    const obj: any = {};
    this.columns.forEach((col, index) => {
      obj[col] = row[index] !== undefined ? row[index] : null;
    });
    return obj as T;
  }

  protected mapObjectToRow(obj: T): any[] {
    return this.columns.map(col => obj[col] !== undefined ? obj[col] : '');
  }

  async getAll(): Promise<T[]> {
    return this.getRows();
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | null> {
    const items = await this.find(predicate);
    return items.length > 0 ? items[0] : null;
  }

  async update(idKey: keyof T, idValue: string, item: Partial<T>): Promise<void> {
    const rowIndex = await this.sheetsService.findRowIndex(this.sheetName, 'A', idValue);
    if (rowIndex === -1) throw ApiError.notFound(`${String(idKey)} ${idValue} not found`);

    const existing = await this.findOne(i => i[idKey] === idValue);
    const updated = { ...existing, ...item } as T;
    const row = this.mapObjectToRow(updated);
    
    await this.sheetsService.updateRow(`${this.sheetName}!A${rowIndex}:Z${rowIndex}`, row);
  }

  async delete(idValue: string): Promise<void> {
    const rowIndex = await this.sheetsService.findRowIndex(this.sheetName, 'A', idValue);
    if (rowIndex === -1) return;

    const sheetId = await this.sheetsService.getSheetId(this.sheetName);
    await this.sheetsService.deleteRowByIndex(sheetId, rowIndex - 1);
  }
}
