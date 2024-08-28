# Wolfden UI Form

## Descripción

`@wolfden-ui/form` es una biblioteca para gestionar formularios en aplicaciones `React`, ofreciendo una funcionalidad reactiva similar a la que se utiliza en `Angular`.

## Instalación

Puedes instalar la biblioteca utilizando npm o yarn:

```bash
npm install @wolfden-ui/form
```

```bash
yarn add @wolfden-ui/form
```

## Uso

### Controlador

El hook `useFormControl` permite gestionar el estado de inputs, selects, textareas y otros componentes de React como `Dropdown`. Este hook devuelve un objeto `FormControl`, que te permite interactuar con el valor y estado del campo.

```tsx
export function Input({}: Props) {
	const input = useFormControl({ value: "" })

	return <input value={input.value} onChange={(ev) => input.setValue(ev.target.value)} />
}
```

### Argumentos

| Propiedad              | Tipo                  | Requerido | Valor por defecto | Descripción                                        |
| ---------------------- | --------------------- | --------- | ----------------- | -------------------------------------------------- |
| schema                 | `FormControlSchema`   | Sí        |                   | Esquema de configuración del control.              |
| schema.value           | `V`                   | Sí        |                   | Valor inicial del control.                         |
| schema.disabled        | `boolean`             | No        | `false`           | Indica si el control está deshabilitado.           |
| schema.validators      | `ValidatorFn[]`       | No        | `[]`              | Lista de funciones de validación síncronas.        |
| schema.asyncValidators | `AsyncValidatorFn[]`  | No        | `[]`              | Lista de funciones de validación asíncronas.       |
| schema.mask            | `MaskFn`              | No        | `null`            | Función para aplicar una máscara al valor.         |
| schema.parse           | `ParseFn`             | No        | `null`            | Función para transformar el valor antes de usarlo. |
| options                | `UseFormControlProps` | No        | `{}`              | Opciones adicionales de configuración.             |
| options.name           | `string`              | No        | `""`              | Nombre del control.                                |
| options.control        | `FormControl`         | No        |                   | Control existente para extender.                   |
| options.debounce       | `number`              | No        | `500`             | Tiempo de espera antes de aplicar el cambio.       |

### FormControl

El objeto `FormControl` proporciona una API rica para gestionar el estado del formulario.

| Propiedad          | Tipo                                                                  | Descripción                                               |
| ------------------ | --------------------------------------------------------------------- | --------------------------------------------------------- |
| name               | `string`                                                              | Nombre del control.                                       |
| value              | `V`                                                                   | Valor actual del control.                                 |
| parsed             | `any`                                                                 | Valor parseado según la función de parseo.                |
| status             | `ControlStatus`                                                       | Estado actual del control `VALID`, `INVALID` o `PENDING`. |
| error              | `ValidatorError \| null`                                              | Error de validación actual, si existe.                    |
| isTouched          | `boolean`                                                             | Indica si el control ha sido tocado.                      |
| isDirty            | `boolean`                                                             | Indica si el valor del control ha sido modificado.        |
| isDisabled         | `boolean`                                                             | Indica si el control está deshabilitado.                  |
| isIndeterminate    | `boolean`                                                             | Indica si el valor es indeterminado.                      |
| isValid            | `boolean`                                                             | Indica si el valor es válido.                             |
| isInvalid          | `boolean`                                                             | Indica si el valor es inválido.                           |
| isPending          | `boolean`                                                             | Indica si la validación está pendiente.                   |
| setValue           | `(value: V) => void`                                                  | Establece un nuevo valor para el control.                 |
| reset              | `() => void`                                                          | Reinicia el control a su estado inicial.                  |
| validate           | `() => void`                                                          | Ejecuta las validaciones síncronas de forma manual.       |
| asyncValidate      | `() => void`                                                          | Ejecuta las validaciones asíncronas de forma manual.      |
| setValidators      | `(validators: ValidatorFn[], revalidate?: boolean) => void`           | Establece nuevas funciones de validación.                 |
| setAsyncValidators | `(asyncValidators: AsyncValidatorFn[], revalidate?: boolean) => void` | Establece nuevas funciones de validación asíncrona.       |
| setMask            | `(mask: MaskFn, emitSelf?: boolean) => void`                          | Establece una nueva función de máscara.                   |
| setParse           | `(parse: ParseFn, emitSelf?: boolean) => void`                        | Establece una nueva función de parseo.                    |
| setError           | `(error: ValidatorError \| null) => void`                             | Establece un error manualmente.                           |
| enabled            | `() => void`                                                          | Habilita el control.                                      |
| disabled           | `() => void`                                                          | Deshabilita el control.                                   |
| markAsDirty        | `() => void`                                                          | Marca el control como modificado.                         |
| markAsPristine     | `() => void`                                                          | Marca el control como no modificado.                      |
| markAsTouched      | `() => void`                                                          | Marca el control como tocado.                             |
| markAsUntouched    | `() => void`                                                          | Marca el control como no tocado.                          |

### Controlador de Errores

Existen tres formas principales de gestionar los errores en los formularios:

1. **Validadores Síncronos y Asíncronos**: Los `validators` y `asyncValidators` son funciones que pueden devolver un `ValidatorError` si se detecta un error, o `null` si no hay ningún problema. Estas funciones se basan en el valor actual del campo, el estado del formulario, y pueden recibir argumentos adicionales según se defina en los tipos `ValidatorFn` y `AsyncValidatorFn`.

#### Ejemplo de Validadores

Primero, creamos los validadores necesarios para nuestro controlador:

```ts
export const required: ValidatorFn = (value: any) => {
	if (value === null || value === undefined || value === "") return { required: true }
	return null
}

export const email: ValidatorFn = (value: any) => {
	if (value === null) return { email: true }
	if (typeof value !== "string") return { email: true }
	if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return { email: true }
	return null
}

export const validateEmailExist: AsyncValidatorFn = async (value: any) => {
	const isExist = await validateInServerIsEmailExist(value)
	if (isExist) return { emailIsExist: true }
	return null
}
```

Luego, añadimos estos validadores al controlador de nuestro formulario:

```tsx
import * as Validators from "./validators"

function InputEmail({}: Props) {
	const input = useFormControl({
		value: "",
		validators: [Validators.required, Validators.email],
		asyncValidators: [Validators.validateEmailExist],
	})

	return <input type="email" value={input.value} onChange={(ev) => input.setValue(ev.target.value)} />
}
```

2. **Asignación Manual de Errores**: Además de los validadores, puedes manejar los errores de manera manual utilizando el método `setError`. Esto es útil en casos específicos donde necesitas aplicar una lógica adicional para establecer un error.

```tsx
import * as Validators from "./validators"

function InputEmail({}: Props) {
	const input = useFormControl({
		value: "",
		validators: [Validators.required, Validators.email],
		asyncValidators: [Validators.validateEmailExist],
	})

	useEffect(() => {
		if (input.isInvalid) return
		const isJoe = input.value === "joe@doe.com"
		if (isJoe) input.setError({ isJoe: true })
	}, [input.value])

	return <input type="email" value={input.value} onChange={(ev) => input.setValue(ev.target.value)} />
}
```

### MaskFn y ParseFn

En `@wolfden-ui/form`, las funciones `MaskFn` y `ParseFn` son herramientas poderosas que permiten manipular el valor de los campos de formulario antes de que se guarde en el estado o se procese de alguna manera. Estas funciones son útiles para asegurar que los datos capturados por el usuario estén en el formato correcto y para transformar los datos antes de su validación o almacenamiento.

#### 1. **MaskFn: Aplicación de Máscaras a los Valores**

**`MaskFn`** es una función que se utiliza para modificar el valor de entrada del usuario en tiempo real, antes de que se almacene en el estado del formulario. Esto es útil en casos donde se necesita que el valor siga un formato específico, como números de teléfono, códigos postales o fechas.

##### Ejemplo de `MaskFn`

Aquí tienes un ejemplo de cómo se puede utilizar `MaskFn` para formatear un número de teléfono:

```ts
export const phoneMask: MaskFn = (value: string) => {
	const cleaned = ("" + value).replace(/\D/g, "") // Elimina todo excepto dígitos
	const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

	if (match) {
		return `(${match[1]}) ${match[2]}-${match[3]}`
	}

	return value
}
```

En este ejemplo, `phoneMask` toma un valor de entrada y lo convierte en un formato de número de teléfono estándar, como `(123) 456-7890`. Esta máscara se aplicaría cada vez que el usuario introduce un número en el campo, garantizando que el formato sea consistente.

##### Uso de `MaskFn` en un Formulario

```tsx
function PhoneNumberInput({}: Props) {
	const phoneInput = useFormControl({
		value: "",
		mask: phoneMask,
	})

	return <input type="text" value={phoneInput.value} onChange={(ev) => phoneInput.setValue(ev.target.value)} />
}
```

En este ejemplo, el campo de número de teléfono aplicará automáticamente la máscara definida cada vez que el usuario introduzca un valor.

#### 2. **ParseFn: Transformación de Valores de Entrada**

**`ParseFn`** es una función que se utiliza para transformar el valor de entrada antes de que se valide o se almacene en el estado. A diferencia de `MaskFn`, que modifica el valor visible, `ParseFn` transforma el valor de una forma que puede no ser visible para el usuario, pero que es esencial para el procesamiento o almacenamiento de los datos.

##### Ejemplo de `ParseFn`

Aquí tienes un ejemplo de cómo `ParseFn` puede usarse para convertir una cadena de texto en un número:

```ts
export const parseToNumber: ParseFn = (value: string) => {
	const number = parseFloat(value.replace(/,/g, "")) // Elimina las comas y convierte a número
	return isNaN(number) ? null : number
}
```

En este caso, `parseToNumber` toma un valor de entrada que puede incluir comas como separadores de miles (por ejemplo, `1,234.56`) y lo convierte en un número flotante (`1234.56`).

##### Uso de `ParseFn` en un Formulario

```tsx
function PriceInput({}: Props) {
	const priceInput = useFormControl({
		value: "",
		parse: parseToNumber,
	})

	return <input type="text" value={priceInput.value} onChange={(ev) => priceInput.setValue(ev.target.value)} />
}
```

En este ejemplo, el campo de precio aceptará una entrada con formato de texto, pero al almacenarla, la convertirá en un número para su posterior uso en cálculos o validaciones.

#### 3. **Uso Combinado de `MaskFn` y `ParseFn`**

Es posible utilizar `MaskFn` y `ParseFn` conjuntamente para aplicar una máscara al valor visible y luego transformar ese valor antes de que se guarde en el estado.

##### Ejemplo Combinado

```tsx
export const currencyMask: MaskFn = (value: string) => {
	return `$${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` // Aplica formato de moneda
}

export const parseCurrency: ParseFn = (value: string) => {
	return parseFloat(value.replace(/[$,]/g, "")) // Elimina símbolos de dólar y comas, y convierte a número
}

function CurrencyInput({}: Props) {
	const currencyInput = useFormControl({
		value: "",
		mask: currencyMask,
		parse: parseCurrency,
	})

	return <input type="text" value={currencyInput.value} onChange={(ev) => currencyInput.setValue(ev.target.value)} />
}
```

En este caso, el campo de entrada mostrará un valor con formato de moneda mientras el usuario escribe (`$1,234.56`), pero almacenará el valor como un número flotante (`1234.56`) para ser utilizado posteriormente.

Sí, algunas de las propiedades de `FormControl` podrían beneficiarse de una explicación más detallada en la documentación, especialmente aquellas que no son tan intuitivas o que tienen un impacto significativo en el comportamiento del formulario. Aquí te proporciono una lista de propiedades que podrían necesitar más contexto, junto con una breve explicación y ejemplos:

### 1. **`status`**

**Descripción**: La propiedad `status` indica el estado actual del control. Este puede ser uno de varios valores como `VALID`, `INVALID`, o `PENDING`.

**Ampliación Sugerida**: Explica cómo y cuándo cambian los estados, y cómo pueden afectar la lógica de la aplicación. Por ejemplo, `PENDING` se utiliza durante la validación asíncrona.

**Ejemplo**:

```tsx
function StatusIndicator({}: Props) {
	const input = useFormControl({ value: "" })

	return (
		<div>
			<input value={input.value} onChange={(ev) => input.setValue(ev.target.value)} />
			<span>{input.status}</span>
		</div>
	)
}
```

En este ejemplo, el estado del control (`VALID`, `INVALID`, etc.) se muestra junto al campo de entrada.

### 2. **`parsed`**

**Descripción**: La propiedad `parsed` contiene el valor del campo después de haber sido procesado por `ParseFn`. Esto es útil si necesitas acceder al valor transformado para validaciones o cálculos adicionales.

**Ampliación Sugerida**: Explica cómo se diferencia de `value` y cuándo es importante utilizar `parsed` en lugar de `value`.

**Ejemplo**:

```tsx
function ParsedValueExample({}: Props) {
	const input = useFormControl({
		value: "1000",
		parse: parseToNumber,
	})

	return (
		<div>
			<input value={input.value} onChange={(ev) => input.setValue(ev.target.value)} />
			<p>Valor Parseado: {input.parsed}</p>
		</div>
	)
}
```

Este ejemplo muestra cómo se utiliza `parsed` para obtener el valor numérico de una entrada que inicialmente es una cadena de texto.

### 3. **`isTouched` y `isDirty`**

**Descripción**:

-   `isTouched` es una propiedad booleana que indica si el campo ha sido tocado (es decir, si el usuario ha interactuado con el campo al menos una vez).
-   `isDirty` indica si el valor del campo ha sido modificado desde su valor inicial.

**Ampliación Sugerida**: Explica la diferencia entre `touched` y `dirty`, y cómo estas propiedades pueden influir en la validación y el manejo de errores.

**Ejemplo**:

```tsx
function InteractionExample({}: Props) {
	const input = useFormControl({ value: "" })

	return (
		<div>
			<input value={input.value} onChange={(ev) => input.setValue(ev.target.value)} onBlur={() => input.markAsTouched()} />
			<p>Tocado: {input.isTouched ? "Sí" : "No"}</p>
			<p>Modificado: {input.isDirty ? "Sí" : "No"}</p>
		</div>
	)
}
```

En este ejemplo, se muestra cómo `isTouched` y `isDirty` cambian en función de la interacción del usuario con el campo.

### 4. **`isIndeterminate`**

**Descripción**: La propiedad `isIndeterminate` se usa para indicar un estado intermedio en casos donde el valor del campo no puede ser determinado como completamente `checked` o `unchecked`. Es común en checkboxes que representan una selección parcial.

**Ampliación Sugerida**: Explica cuándo y por qué utilizar `isIndeterminate`, especialmente en formularios con opciones múltiples o jerarquías de selección.

**Ejemplo**:

```tsx
function IndeterminateExample({}: Props) {
	const checkbox = useFormControl({ value: false })

	useEffect(() => {
		checkbox.setIndeterminate(true) // Se establece como indeterminado al iniciar
	}, [])

	return (
		<div>
			<input
				type="checkbox"
				checked={checkbox.value}
				onChange={(ev) => checkbox.setValue(ev.target.checked)}
				ref={(el) => {
					if (el) el.indeterminate = checkbox.isIndeterminate
				}}
			/>
			<p>Indeterminado: {checkbox.isIndeterminate ? "Sí" : "No"}</p>
		</div>
	)
}
```

Este ejemplo muestra cómo se puede utilizar `isIndeterminate` para gestionar estados intermedios en un checkbox.

### 5. **`enabled` y `disabled`**

**Descripción**: Estos métodos permiten habilitar o deshabilitar un control de forma programática. Cuando un control está deshabilitado, no es editable ni se valida.

**Ampliación Sugerida**: Explica cómo y cuándo se deben usar estos métodos, y cómo afectan a la validación y al envío de formularios.

**Ejemplo**:

```tsx
function ToggleDisabledExample({}: Props) {
	const input = useFormControl({ value: "", disabled: true })

	return (
		<div>
			<input value={input.value} onChange={(ev) => input.setValue(ev.target.value)} disabled={input.isDisabled} />
			<button onClick={() => input.enabled()}>Habilitar</button>
			<button onClick={() => input.disabled()}>Deshabilitar</button>
		</div>
	)
}
```

En este ejemplo, los botones permiten al usuario habilitar o deshabilitar el campo de entrada.

### 6. **`validate` y `asyncValidate`**

**Descripción**: Estos métodos se utilizan para activar manualmente la validación síncrona y asíncrona del campo. Son útiles cuando necesitas forzar una validación fuera del ciclo de vida normal del formulario.

**Ampliación Sugerida**: Explica cuándo es necesario llamar a estos métodos manualmente y cómo se integran con los validadores definidos.

**Ejemplo**:

```tsx
function ManualValidationExample({}: Props) {
	const input = useFormControl({
		value: "",
		validators: [Validators.required, Validators.email],
	})

	return (
		<div>
			<input value={input.value} onChange={(ev) => input.setValue(ev.target.value)} />
			<button onClick={() => input.validate()}>Validar</button>
			{input.isInvalid && <p>Error: {input.error?.email ? "Email no válido" : "Campo requerido"}</p>}
		</div>
	)
}
```

Este ejemplo muestra cómo se puede desencadenar la validación manualmente y manejar los errores resultantes.

### `useFormGroup`

El hook `useFormGroup` es parte de la biblioteca `@wolfden-ui/form` y está diseñado para gestionar el estado y la validación de un formulario completo en React. Este hook devuelve un objeto `FormGroup` que ofrece varias utilidades para manipular y consultar el estado del formulario.

### Argumentos

```ts
export type FormGroupSchema<T extends object = any> = {
	[K in keyof T]: FormControlSchema<T[K]>
}
```

| Propiedad        | Tipo                  | Requerido | Valor por defecto | Descripción                                                                           |
| ---------------- | --------------------- | --------- | ----------------- | ------------------------------------------------------------------------------------- |
| schema           | `FormGroupSchema`     | Sí        |                   | Define la estructura del formulario. Cada campo corresponde a un `FormControlSchema`. |
| options          | `UseFormGroupOptions` | No        | `{}`              | Opciones adicionales de configuración.                                                |
| options.debounce | `number`              | No        | `500`             | Tiempo de espera en milisegundos antes de aplicar el cambio al formulario.            |

### `FormGroup`

El objeto `FormGroup` que se devuelve de `useFormGroup` contiene las siguientes propiedades y métodos:

| Propiedad     | Tipo                                                | Descripción                                                                  |
| ------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| values        | `T[]`                                               | Valor actual del formulario.                                                 |
| status        | `ControlStatus`                                     | Estado actual del formulario: `VALID`, `INVALID` o `PENDING`.                |
| errors        | `FormControlError`                                  | Objeto que indica cuáles son los controles que tienen errores de validación. |
| isValid       | `boolean`                                           | Indica si el formulario es válido.                                           |
| isInvalid     | `boolean`                                           | Indica si algún control dentro del formulario es inválido.                   |
| isPending     | `boolean`                                           | Indica si algún control dentro del formulario está en estado pendiente.      |
| find          | `(path) => FormControl \| null`                     | Busca y devuelve un `FormControl` correspondiente a un campo específico.     |
| add           | `(path: string, schema: FormControlSchema) => void` | Agrega un nuevo control al formulario en la ruta especificada.               |
| remove        | `(path: string) => void`                            | Elimina el control en la ruta especificada del formulario.                   |
| setValue      | `(value: Partial<T>) => void`                       | Establece nuevos valores sobre en el formulario                              |
| reset         | `() => void`                                        | Reinicia el formulario a su estado inicial.                                  |
| validate      | `() => void`                                        | Valida manualmente todos los controles dentro del formulario.                |
| asyncValidate | `() => void`                                        | Realiza la validación asincrónica de todos los controles del formulario.     |

Este hook es esencial cuando necesitas manejar formularios complejos con múltiples campos interdependientes, ofreciendo un control centralizado sobre la validación y el estado del formulario.

Aquí tienes la documentación en markdown para `useFormArray`:

### `useFormArray`

El hook `useFormArray` controla un arreglo de formularios y devuelve un `FormArray`, que permite manejar múltiples formularios de manera conjunta.

#### Argumentos

```ts
export type FormGroupSchema<T extends object = any> = {
	[K in keyof T]: FormControlSchema<T[K]>
}
```

| Propiedad        | Tipo                  | Requerido | Valor por defecto | Descripción                                  |
| ---------------- | --------------------- | --------- | ----------------- | -------------------------------------------- |
| schema           | `FormGroupSchema`     | Sí        |                   |                                              |
| options          | `UseFormArrayOptions` | No        | `{}`              | Opciones adicionales de configuración.       |
| options.debounce | `number`              | No        | `500`             | Tiempo de espera antes de aplicar el cambio. |

#### `FormArray`

| Propiedad     | Tipo                                                   | Descripción                                                                     |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| values        | `T[]`                                                  | Valor actual del arreglo de formularios.                                        |
| status        | `ControlStatus`                                        | Estado actual del arreglo de formularios: `VALID`, `INVALID` o `PENDING`.       |
| errors        | `FormControlError[]`                                   | Errores presentes en los formularios del arreglo.                               |
| isValid       | `boolean`                                              | Indica si todos los formularios en el arreglo son válidos.                      |
| isInvalid     | `boolean`                                              | Indica si algún formulario en el arreglo es inválido.                           |
| isPending     | `boolean`                                              | Indica si algún formulario en el arreglo está pendiente.                        |
| length        | `number`                                               | Número de formularios en el arreglo.                                            |
| map           | `(mapFn: (group: FormGroup, index: number) => R): R[]` | Itera sobre los formularios del arreglo y aplica la función `mapFn` a cada uno. |
| find          | `(at: number) => FormGroup \| null`                    | Busca un formulario en el arreglo por su índice.                                |
| push          | `(schema: FormGroupSchema) => void`                    | Agrega un nuevo formulario al final del arreglo.                                |
| unshift       | `(schema: FormGroupSchema) => void`                    | Agrega un nuevo formulario al inicio del arreglo.                               |
| remove        | `(at: number) => void`                                 | Elimina un formulario del arreglo por su índice.                                |
| reset         | `() => void`                                           | Reinicia todos los formularios en el arreglo a su estado inicial.               |
| validate      | `() => void`                                           | Valida todos los formularios en el arreglo.                                     |
| asyncValidate | `() => void`                                           | Valida asíncronamente todos los formularios en el arreglo.                      |
