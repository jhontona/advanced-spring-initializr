import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { environment} from '../environments/environment';
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
export class AppComponent {
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
  });

  onChangeData() {
    this.springForm.get('package_name')?.setValue(this.springForm.get('group')?.getRawValue() + '.' + this.springForm.get('artifact')?.getRawValue())
    this.springForm.get('name')?.setValue(this.springForm.get('artifact')?.getRawValue())
  }

  async comprimirArchivos() {
    const zip = new JSZip();
    
    // Agrega archivos al zip
    zip.file('archivo1.txt', 'Contenido del archivo 1');
    zip.file('archivo2.txt', 'Contenido del archivo 2');

    // Crea una carpeta y agrega archivos a la carpeta
    const carpeta = zip.folder('mi_carpeta');
    carpeta?.file('archivo3.txt', 'Contenido del archivo 3');
    carpeta?.file('archivo4.txt', 'Contenido del archivo 4');

    // Genera el archivo comprimido (ZIP)
    const contenidoZip = await zip.generateAsync({ type: 'blob' });

    // Descarga el archivo comprimido
    FileSaver.saveAs(contenidoZip, 'archivos_comprimidos.zip');
  }
}
