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
    user: new FormControl(`APP_USR_${this.genRandString(5)}`),
    password: new FormControl(this.genRandString(10)),
    port: new FormControl(Math.trunc(Math.random() * 10000).toString().slice(-4)),
    path: new FormControl('/api/v1'),
    app_version: new FormControl('1.0.0'),
    use_term: new FormControl('https://jhontona.com/aviso-legal/'),
    contact: new FormControl('Jhontona'),
    web: new FormControl('https://jhontona.com'),
    email: new FormControl('contacto@jhontona.com'),
    license: new FormControl('Copyright'),
    policy: new FormControl('https://jhontona.com/politica-de-privacidad/'),
  });

  pom = '';
  gitignore = '';
  help = '';
  mvnw1 = '';
  mvnw2 = '';
  readme = '';
  wrapper_jar = '';
  wrapper_prod = '';
  application_properties = '';
  application_class = '';
  swagger = '';
  app_status = '';
  status_service = '';
  info_controller = '';
  service = '';
  controller = '';
  security = '';

  constructor(private template: TemplateService) { 
  }

  ngOnInit() {
    this.template.leerArchivo('pom.xml').subscribe(data => {
      this.pom = data;
    });

    this.template.leerArchivo('.gitignore').subscribe(data => {
      this.gitignore = data;
    });

    this.template.leerArchivo('HELP.md').subscribe(data => {
      this.help = data;
    });

    this.template.leerArchivo('mvnw').subscribe(data => {
      this.mvnw1 = data;
    });

    this.template.leerArchivo('mvnw.cmd').subscribe(data => {
      this.mvnw2 = data;
    });

    this.template.leerArchivo('README.md').subscribe(data => {
      this.readme = data;
    });

    this.template.leerArchivo('.mvn/wrapper/maven-wrapper.jar').subscribe(data => {
      this.wrapper_jar = data;
    });

    this.template.leerArchivo('.mvn/wrapper/maven-wrapper.properties').subscribe(data => {
      this.wrapper_prod = data;
    });

    this.template.leerArchivo('src/main/resources/application.properties').subscribe(data => {
      this.application_properties = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/ArtifactDemoApplication.java').subscribe(data => {
      this.application_class = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/web/config/SwaggerConfig.java').subscribe(data => {
      this.swagger = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/web/controller/AppInfoController.java').subscribe(data => {
      this.info_controller = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/web/controller/DemoController.java').subscribe(data => {
      this.controller = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/domain/DTO/AppStatus.java').subscribe(data => {
      this.app_status = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/domain/service/AppStatusService.java').subscribe(data => {
      this.status_service = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/domain/service/DemoService.java').subscribe(data => {
      this.service = data;
    });

    this.template.leerArchivo('src/main/java/com/jhontona/artifactDemo/web/security/WebSecurityConfig.java').subscribe(data => {
      this.security = data;
    });
  }

  onChangeData() {
    this.springForm.get('package_name')?.setValue(this.springForm.get('group')?.getRawValue() + '.' + this.springForm.get('artifact')?.getRawValue())
    this.springForm.get('name')?.setValue(this.springForm.get('artifact')?.getRawValue())
  }

  getPom() : string {
    return this.pom.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{description}}/g, this.springForm.get('description')?.getRawValue())
      .replace(/{{java_version}}/g, this.springForm.get('java')?.getRawValue())
      .replace(/{{spring_version}}/g, this.springForm.get('spring_boot')?.getRawValue());
  }

  getApplicationClass() : string {
    return this.application_class.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{artifactC}}/g, this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue()))
      .replace(/{{spring_version}}/g, this.springForm.get('spring_boot')?.getRawValue());
  }

  getProperties() : string {
    return this.application_properties.replace(/{{port}}/g, this.springForm.get('port')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{artifactL}}/g, this.springForm.get('artifact')?.getRawValue().toLowerCase())
      .replace(/{{path}}/g, this.springForm.get('path')?.getRawValue())
      .replace(/{{app_version}}/g, this.springForm.get('app_version')?.getRawValue())
      .replace(/{{user}}/g, this.springForm.get('user')?.getRawValue())
      .replace(/{{password}}/g, this.springForm.get('password')?.getRawValue());
  }

  getDocumentation() : string {
    return this.swagger.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{artifactC}}/g, this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue()))
      .replace(/{{description}}/g, this.springForm.get('description')?.getRawValue())
      .replace(/{{use_term}}/g, this.springForm.get('use_term')?.getRawValue())
      .replace(/{{contact}}/g, this.springForm.get('contact')?.getRawValue())
      .replace(/{{web}}/g, this.springForm.get('web')?.getRawValue())
      .replace(/{{email}}/g, this.springForm.get('email')?.getRawValue())
      .replace(/{{license}}/g, this.springForm.get('license')?.getRawValue())
      .replace(/{{policy}}/g, this.springForm.get('policy')?.getRawValue());
  }

  getAppStatus() : string {
    return this.app_status.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue());
  }

  getStatusService() : string {
    return this.status_service.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue());
  }

  getService() : string {
    return this.service.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{artifactC}}/g, this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue()));
  }

  getInfoController() : string {
    return this.info_controller.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue());
  }

  getController() : string {
    return this.controller.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{artifactC}}/g, this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue()))
      .replace(/{{description}}/g, this.springForm.get('description')?.getRawValue());
  }

  getSecurity() : string {
    return this.controller.replace(/{{group}}/g, this.springForm.get('group')?.getRawValue())
      .replace(/{{artifact}}/g, this.springForm.get('artifact')?.getRawValue())
      .replace(/{{artifactC}}/g, this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue()));
  }

  capitalizeFirstLetter(str: string) : string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  genRandString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async comprimirArchivos() {
    const zip = new JSZip();
    const base = zip.folder(this.springForm.get('name')?.getRawValue());
    base?.file('pom.xml', this.getPom());
    base?.file('.gitignore', this.gitignore);
    base?.file('HELP.md', this.help);
    base?.file('mvnw', this.mvnw1);
    base?.file('mvnw.cmd', this.mvnw2);
    base?.file('README.md', this.readme);

    const mvnFolder = base?.folder(".mvn");
    const wrapper = mvnFolder?.folder("wrapper");
    wrapper?.file('maven-wrapper.jar', this.wrapper_jar);
    wrapper?.file('maven-wrapper.properties', this.wrapper_prod);

    const src = base?.folder("src");
    const main = src?.folder("main");
    const resources = main?.folder("resources");
    const staticF = resources?.folder("static");
    const templates = resources?.folder("templates");
    resources?.file('application.properties', this.getProperties());

    const java = main?.folder("java");
    const com = java?.folder(this.springForm.get('group')?.getRawValue().split(".")[0]);
    const domain = com?.folder(this.springForm.get('group')?.getRawValue().split(".")[1]);
    const artifact = domain?.folder(this.springForm.get('artifact')?.getRawValue());
    artifact?.file(`${this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue())}Application.java`, this.getApplicationClass());

    const logic = artifact?.folder('domain');
    const dto = logic?.folder("DTO");
    const service = logic?.folder("service");
    const lRepository = logic?.folder("repository");

    dto?.file('AppStatus.java', this.getAppStatus());
    service?.file('AppStatusService.java', this.getStatusService());
    service?.file(`${this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue())}Service.java`, this.getService());

    const database = artifact?.folder('persistence');
    const crud = database?.folder("CRUD");
    const entity = database?.folder("entity");
    const dRepository = database?.folder("repository");
    const mapper = database?.folder("mapper");

    const web = artifact?.folder('web');
    const config = web?.folder("config");
    config?.file('SwaggerConfig.java', this.getDocumentation());

    const controller = web?.folder("controller");
    controller?.file(`${this.capitalizeFirstLetter(this.springForm.get('artifact')?.getRawValue())}Controller.java`, this.getController());
    controller?.file('AppinfoController.java', this.getInfoController());

    const security = web?.folder("security");
    security?.file('WebSecurityConfig.java', this.getSecurity());

    // Genera el archivo comprimido (ZIP)
    const contenidoZip = await zip.generateAsync({ type: 'blob' });

    // Descarga el archivo comprimido
    FileSaver.saveAs(contenidoZip, this.springForm.get('name')?.getRawValue() + '.zip');
  }
}
