import { AfterContentInit, Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { forbiddenStringValidator } from 'src/app/helpers/validators'
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
  form: FormGroup = new FormGroup({})
  formSubjects: { [key: string]: unknown } = {}

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
    })

    this.formSubjects = {
      email: new BehaviorSubject<string>(''),
      password: new BehaviorSubject<string>(''),
      area: new BehaviorSubject<string>(''),
      drop: new BehaviorSubject<string>(''),
    }
  }

  ngAfterContentInit(): void {
    this.isPageLoaded = true

    this.form.valueChanges.subscribe((v) => {
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
    })
  }

  readonly onSubmit = () => {
    this.showValidationMessage = false

    if (this.form.invalid) {
      setTimeout(() => {
        this.showValidationMessage = true
      }, 10)
      return
    }
  }

  readonly getBehaviorSubjectString = (
    key: string,
  ): BehaviorSubject<string> => {
    const subject = this.formSubjects[key]

    if (this.isBehaviorSubject<string>(subject)) {
      return subject
    }

    return new BehaviorSubject<string>('')
  }

  readonly getBehaviorSubjectNumber = (
    key: string,
  ): BehaviorSubject<number> => {
    const subject = this.formSubjects[key]

    if (this.isBehaviorSubject<number>(subject)) {
      return subject
    }

    return new BehaviorSubject<number>(0)
  }

  readonly getBehaviorSubjectBoolean = (
    key: string,
  ): BehaviorSubject<boolean> => {
    const subject = this.formSubjects[key]

    if (this.isBehaviorSubject<boolean>(subject)) {
      return subject
    }

    return new BehaviorSubject<boolean>(false)
  }

  readonly getBehaviorSubjectArray = (
    key: string,
  ): BehaviorSubject<string[]> => {
    const subject = this.formSubjects[key]

    if (this.isBehaviorSubject<string[]>(subject)) {
      return subject
    }

    return new BehaviorSubject<string[]>([])
  }

  private readonly isBehaviorSubject = <T>(
    object: unknown,
  ): object is BehaviorSubject<T> => {
    if (!object || typeof object !== 'object') return false

    return true
  }
}
