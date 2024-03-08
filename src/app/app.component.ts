import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { environment} from '../environments/environment';
import { TemplateService } from './template.service';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Advanced spring initializr';
  versions = environment.spring_boot_versions;
  matcher = new MyErrorStateMatcher();
  java_versions = environment.java;

  springForm = new FormGroup({
    project: new FormControl('3'),
    language: new FormControl('1'),
    spring_boot: new FormControl(this.versions[0]),
    group: new FormControl(environment.group, [Validators.required, Validators.pattern("([a-zA-Z]{2,}).([a-zA-Z0-9.-]{2,})")]),
    artifact: new FormControl(environment.artifact, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("([a-zA-Z][a-zA-Z0-9._-]*)")]),
    name: new FormControl({ value: environment.name, disabled: true }),
    description: new FormControl(environment.description),
    package_name: new FormControl({ value: environment.group + '.' + environment.artifact, disabled: true }),
    packaging: new FormControl('1'),
    java: new FormControl(this.java_versions[0]),
    architecture: new FormControl('DDD'),
  });

  pom = '';

  constructor(private template: TemplateService) { }

  ngOnInit() {
    this.template.leerArchivo('pom.xml').subscribe(data => {
      this.pom = data;
    });
  }

  onChangeData() {
    this.springForm.get('package_name')?.setValue(this.springForm.get('group')?.getRawValue() + '.' + this.springForm.get('artifact')?.getRawValue())
    this.springForm.get('name')?.setValue(this.springForm.get('artifact')?.getRawValue())
  }

  getPom() : string {
    console.log(this.springForm.get('group')?.getRawValue());
    this.pom.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue());
      /*.replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{description}}/g, this.springForm.get('description')?.getRawValue())
      .replace(/{{java_version}}/g, this.springForm.get('java')?.getRawValue())
      .replace(/{{spring_version}}/g, this.springForm.get('spring_boot')?.getRawValue());*/
    console.log(this.pom);
    return this.pom;
  }

  async comprimirArchivos() {
    const zip = new JSZip();
    const base = zip.folder(this.springForm.get('name')?.getRawValue());
    base?.file('pom.xml', this.getPom());

    // Genera el archivo comprimido (ZIP)
    const contenidoZip = await zip.generateAsync({ type: 'blob' });

    // Descarga el archivo comprimido
    FileSaver.saveAs(contenidoZip, this.springForm.get('name')?.getRawValue() + '.zip');
  }
}
