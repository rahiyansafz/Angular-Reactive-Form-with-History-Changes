import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder
} from "@angular/forms";

import { debounceTime, filter } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  saveValueChanges = true;
  userForm: FormGroup;
  changes: Array<{ changedAt: Date; changes: any }>;

  ngOnInit() {
    this.initializeChanges();
    this.userForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      token: new FormControl("", [
        Validators.required,
        Validators.minLength(5)
      ]),
      role: new FormControl()
    });

    this.userForm.valueChanges
      .pipe(
        filter(() => this.saveValueChanges),
        debounceTime(500)
      )
      .subscribe(values =>
        this.changes.splice(0, 0, { changedAt: new Date(), changes: values })
      );
  }

  rollBack(rollBackItem: { changedAt: Date; changes: any }): void {
    this.saveValueChanges = false;
    this.userForm.setValue(rollBackItem.changes);
    this.saveValueChanges = true;
  }

  initializeChanges() {
    this.changes = new Array<{ changedAt: Date; changes: any }>();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      alert("Please fix errors");
      return;
    }

    console.log(this.userForm.value);
  }
}
