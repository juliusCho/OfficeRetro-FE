import { AfterContentInit, Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BehaviorSubject, Subscription } from 'rxjs'
import { forbiddenStringValidator } from 'src/app/helpers/form-validators'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent
  extends BasePageComponent
  implements AfterContentInit, OnInit
{
  showValidationMessage = false
  form?: FormGroup
  formSubjects: { [key: string]: unknown } = {}

  private _formSubscription$?: Subscription

  get formGroup() {
    return this.form as FormGroup
  }

  get emailValidator() {
    return (value?: string) => {
      if (!value) return ''

      if (/ /g.test(value)) {
        return 'Email should not contain blank space'
      }

      if (
        !value
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          )
      ) {
        return 'Invalid email format'
      }

      return ''
    }
  }

  constructor(private readonly formBuilder: FormBuilder) {
    super()
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        forbiddenStringValidator(/ /g),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        forbiddenStringValidator(/ /g),
      ]),
      area: new FormControl('', [Validators.maxLength(5000)]),
      drop: new FormControl('', [Validators.required]),
      radio: new FormControl('', [Validators.required]),
      check: new FormControl(
        [],
        [Validators.required, Validators.maxLength(2)],
      ),
    })

    this.formSubjects = {
      email: new BehaviorSubject<string>(''),
      password: new BehaviorSubject<string>(''),
      area: new BehaviorSubject<string>(''),
      drop: new BehaviorSubject<string>(''),
      radio: new BehaviorSubject<string>(''),
      check: new BehaviorSubject<string[]>([]),
    }
  }

  ngAfterContentInit(): void {
    this.isPageLoaded = true

    this._formSubscription$ = this.form?.valueChanges.subscribe((v) => {
      if (this.isBehaviorSubject<string>(this.formSubjects['email'])) {
        this.formSubjects['email'].next(String(v.email))
      }
      if (this.isBehaviorSubject<string>(this.formSubjects['password'])) {
        this.formSubjects['password'].next(String(v.password))
      }
      if (this.isBehaviorSubject<string>(this.formSubjects['area'])) {
        this.formSubjects['area'].next(String(v.area))
      }
      if (this.isBehaviorSubject<string>(this.formSubjects['drop'])) {
        this.formSubjects['drop'].next(String(v.drop))
      }
      if (this.isBehaviorSubject<string>(this.formSubjects['radio'])) {
        this.formSubjects['radio'].next(String(v.radio))
      }
      if (this.isBehaviorSubject<string[]>(this.formSubjects['check'])) {
        this.formSubjects['check'].next(v.check ? [...v.check] : [])
      }
    })
  }

  readonly onSubmit = () => {
    this.showValidationMessage = false

    if (this.form?.invalid) {
      setTimeout(() => {
        this.showValidationMessage = true
      }, 10)
      return
    }

    this.initializeForm()
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 2000)
  }

  readonly getBehaviorSubjectString = (
    key: string,
  ): BehaviorSubject<string> => {
    return this.getBehaviorSubject<string>(key, '')
  }

  readonly getBehaviorSubjectNumber = (
    key: string,
  ): BehaviorSubject<number> => {
    return this.getBehaviorSubject<number>(key, 0)
  }

  readonly getBehaviorSubjectBoolean = (
    key: string,
  ): BehaviorSubject<boolean> => {
    return this.getBehaviorSubject<boolean>(key, false)
  }

  readonly getBehaviorSubjectArray = (
    key: string,
  ): BehaviorSubject<string[]> => {
    return this.getBehaviorSubject<string[]>(key, [])
  }

  private readonly initializeForm = () => {
    this.form?.setValue({
      email: '',
      password: '',
      area: '',
      drop: '',
      radio: '',
      check: [],
    })
  }

  private readonly getBehaviorSubject = <T>(
    key: string,
    initialValue: T,
  ): BehaviorSubject<T> => {
    const subject = this.formSubjects[key]

    if (this.isBehaviorSubject<T>(subject)) {
      return subject
    }

    return new BehaviorSubject<T>(initialValue)
  }

  private readonly isBehaviorSubject = <T>(
    object: unknown,
  ): object is BehaviorSubject<T> => {
    if (!object || typeof object !== 'object') return false

    return true
  }
}
