import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technical-spec',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './technical-spec.html',
  styleUrl: './technical-spec.scss',
})
export class TechnicalSpec implements OnInit {
  @Input() group!: FormGroup;

  simCardOptions = ['1 sim', '2-sim', '1 sim + e sim'];
  ramOptions = ['3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '36 GB', '48 GB', '64 GB'];
  storageOptions = ['32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
  ssdOptions = ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB', '4 TB', '8 TB'];
  hddOptions = ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB', '4 TB', '8 TB'];

  accessoriesOptions = [
    { en: 'Earbuds', ar: 'سماعات أذن' },
    { en: 'Charger', ar: 'شاحن' },
    { en: 'Original Box', ar: 'العلبة الأصلية' },
    { en: 'USB Cable', ar: 'كابل USB' },
    { en: 'Cover', ar: 'غطاء' },
    { en: 'Pen', ar: 'قلم' },
  ];

  ngOnInit(): void {}

  onRamChange(event: Event, ram: string): void {
    const checkbox = event.target as HTMLInputElement;
    let currentRam = this.group.get('ram')?.value || [];

    if (checkbox.checked) {
      currentRam = [...currentRam, ram];
    } else {
      currentRam = currentRam.filter((r: string) => r !== ram);
    }

    this.group.get('ram')?.setValue(currentRam);
  }

  isRamSelected(ram: string): boolean {
    const currentRam = this.group.get('ram')?.value || [];
    return currentRam.includes(ram);
  }

  onAccessoryChange(event: Event, accessory: { en: string; ar: string }): void {
    const checkbox = event.target as HTMLInputElement;
    const accessoriesGroup = this.group.get('accessories');

    if (!accessoriesGroup) return;

    let enAccessories = accessoriesGroup.get('en')?.value || [];
    let arAccessories = accessoriesGroup.get('ar')?.value || [];

    if (checkbox.checked) {
      enAccessories = [...enAccessories, accessory.en];
      arAccessories = [...arAccessories, accessory.ar];
    } else {
      enAccessories = enAccessories.filter((acc: string) => acc !== accessory.en);
      arAccessories = arAccessories.filter((acc: string) => acc !== accessory.ar);
    }

    accessoriesGroup.patchValue({
      en: enAccessories,
      ar: arAccessories,
    });
  }

  isAccessorySelected(accessory: string): boolean {
    const enAccessories = this.group.get('accessories.en')?.value || [];
    return enAccessories.includes(accessory);
  }
}
