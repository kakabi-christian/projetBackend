import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembreAdmin } from './faq';

describe('MembreAdmin', () => {
  let component: MembreAdmin;
  let fixture: ComponentFixture<MembreAdmin>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembreAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembreAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
