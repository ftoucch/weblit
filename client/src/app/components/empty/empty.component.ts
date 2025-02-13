import { Component, Input } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-empty',
  standalone: true,
  templateUrl: './empty.component.html',
  imports: [NzEmptyModule],
})
export class EmptyComponent {
  @Input() createQuery!: Function;
  @Input() createReview!: Function;
  handleClick(): void {
    if (this.createQuery) {
      this.createQuery();
    }
    if (this.createReview) {
      this.createReview();
    }
  }
}
