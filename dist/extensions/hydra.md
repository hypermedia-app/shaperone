# Hydra integration

[Hydra](http://www.hydra-cg.com/spec/latest/core/) is a W3C Community Group specification for describing Hypermedia APIs using RDF.

Shaperone's Hydra extensions allows the Shape publishers to enrich them with links to remote resources which will be used to populate form elements.

## Installation

```
yarn add @hydrofoil/shaperone-hydra
```

## Usage

### Instances Select Editor

The `dash:InstancesSelectEditor` can be extended to load data dynamically from a remote Hydra Collection resource. To use, add decorators for the matcher and component.

The `matcher` decorator returns score `1` if a property shape has `hydra:collection` or `hydra:search`. In that case, the component decorator will override the default instances selector behaviour and fetch instances from the web.

They will both fall back to standard behavior when no Hydra terms are used on a Property Shape.

```typescript
import * as configure from '@hydrofoil/shaperone-wc/configure'
import { instancesSelector } from '@hydrofoil/shaperone-hydra/components'
import { Hydra } from 'alcaeus/web'

configure.editors.decorate(instancesSelector.matcher)
configure.components.decorate(instancesSelector.decorator({ client: Hydra }))
```

> [!TIP]
> All parameters are optional

## Preparing shapes

### Static collection

Assuming you have an API which exposes a resource `https://example.com/people` which returns a Hydra Collection, add `sh:class`, `dash:editor` and `hydra:collection` to a SHACL Property Shape which should present a selection of said collection's members.

```turtle
prefix sh: <http://www.w3.org/ns/shacl#>
prefix schema: <http://schema.org/>
prefix dash: <http://datashapes.org/dash#>
prefix hydra: <http://www.w3.org/ns/hydra/core#>

<> a sh:NodeShape ; sh:property <SupervisorShape> .

<SupervisorProperty> 
  a sh:PropertyShape ;
  sh:path <http://example.com/vocab#supervisor> ;
  sh:class schema:Person ;
  dash:editor dash:InstancesSelectEditor ;
  hydra:collection <https://example.com/people> ;
.
```

> [!EXAMPLE]
> See an example shape in the [Playground][collection]
 
### Dependent fields

A IRI Template can be used instead of a collection to allow filtering a collection by other values from the given [Focus Node](https://www.w3.org/TR/shacl/#focusNodes).

For example, let's define a form which would display employees only of a specific company. The company would be selected from a field backed by a collection as seen above. The second field however would be filtered by the first selection.

The property shape is similar, with `hydra:collection` being replaced by a `hydra:search` template.

```turtle
prefix sh: <http://www.w3.org/ns/shacl#>
prefix schema: <http://schema.org/>
prefix dash: <http://datashapes.org/dash#>
prefix hydra: <http://www.w3.org/ns/hydra/core#>

<> a sh:NodeShape ; sh:property <CompanyProperty> , <SupervisorShape> .

<CompanyProperty>
  a sh:PropertyShape ;
  sh:path <http://example.com/vocab#company> ;
  sh:class schema:Organization ;
  dash:editor dash:InstancesSelectEditor ;
  hydra:collection <https://example.com/companies> ;
.

<SupervisorShape> 
  a sh:PropertyShape ;
  sh:path <http://example.com/vocab#supervisor> ;
  sh:class schema:Person ;
  dash:editor dash:InstancesSelectEditor ;
  hydra:search [
    a hydra:IriTemplate ;
    hydra:template "https://example.com/people{?company}" ;
    hydra:mapping [
      hydra:property <http://example.com/vocab#company> ;
      hydra:variable "company" ;
      hydra:required true
    ] ;
  ] ;
.
```

The crucial detail is matching a template's `hydra:property` with another property shape's `sh:path`. Of course, both properties must be children of the same Node Shape.

> [!TIP]
> With `hydra:required` the supervisors will only be loaded when a company is selected. If it was `false`, or removed, the people collection would be dereferenced even without the value for `http://example.com/vocab#company` property.

> [!EXAMPLE]
> See an example shape in the [Playground][template]

#### Selecting different focus node for search template

By default, the Focus Node itself is used to provide values to the search template. By adding `sh:path` to the search template it is possible to change that behaviour.

Expanding on the snippet above, a project form could be structured so that a department is selected on the top focus node and then it would be broken down into tasks, each having an assignee who is an employee of said company. The resulting graph could be.

```turtle
prefix doap: <http://usefulinc.com/ns/doap#>
prefix schema: <http://schema.org/>
prefix ex: <http://example.com/>

<> a doap:Project ;
  schema:department </direct-sales> ;
  schema:hasPart [
    a ex:Task ;
    ex:assignee <person/john> ;
  ] , [
    a ex:Task ;
    ex:assignee <person/jane> ;
  ]
.
```

To search for persons by the selected `</direct-sales>` department, have `sh:path` point "up" from the task to the project node. 

```turtle
prefix hydra: <http://www.w3.org/ns/hydra/core#>
prefix schema: <http://schema.org/>
prefix sh: <http://www.w3.org/ns/shacl#>
prefix ex: <http://example.com/>

<ProjectShape> a sh:NodeShape ;
  sh:property [
    sh:path schema:department ;
  ] , [
    sh:path schema:hasPart ;
    sh:node <TaskShape> ;
    sh:class ex:Task ;
  ]
.

<TaskShape> a sh:NodeShape ;
  sh:property [
    sh:path [
      sh:path ex:assignee ;
      hydra:search [
        a hydra:IriTemplate ;
        hydra:template "https://example.com/people{?company}" ;
        sh:path [ sh:inversePath schema:hasPart ] ;
        hydra:mapping [
          hydra:property schema:department ;
          hydra:variable "company" ;
          hydra:required true
        ] ;
      ] ;
    ]
  ]
.
```

> [!EXAMPLE]
> In the linked [Playground example][search-path], the root node is used to select a country, and two child nodes both having a property to search for cities from that country.

[collection]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22foaf%22%3A+%22http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%2C%0A++++%22dcat%22%3A+%22http%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2Fjohn-doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22schema%3Aname%22%3A+%22John+Doe%22%0A%7D&selectedResource=http%3A%2F%2Fexample.com%2Fjohn-doe&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+.%0A%40prefix+dash%3A+%3Chttp%3A%2F%2Fdatashapes.org%2Fdash%23%3E+.%0A%40prefix+hydra%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fhydra%2Fcore%23%3E+.%0A%40prefix+wdt%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E+.%0A%40prefix+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%0Aschema%3APerson%0A++a+rdfs%3AClass%2C+sh%3ANodeShape+%3B%0A++rdfs%3Alabel+%22Register%22+%3B%0A++sh%3Aproperty+ex%3ANameProperty+%2C+ex%3ACountryProperty+%3B%0A.%0A%0Aex%3ANameProperty%0A++sh%3Apath+schema%3Aname+%3B%0A++sh%3Aname+%22Name%22+%3B%0A++sh%3Adatatype+xsd%3Astring+%3B%0A++dash%3AsingleLine+true+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3Aorder+10+%3B%0A.%0A%0Aex%3ACountryProperty%0A++a+sh%3APropertyShape+%3B%0A++sh%3Aname+%22Country%22+%3B%0A++sh%3Aclass+wd%3AQ6256+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++sh%3Apath+wdt%3AP27+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++hydra%3Acollection+%3Chttps%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3Dprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcountry%2520.%250A%2520%2520%253Fcountry%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%250A%2520%2520%253Fcountry%2520wdt%253AP31%2520wd%253AQ6256%2520%253B%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%3E+%3B%0A++sh%3Aorder+20+%3B%0A.%0A&disableEditorChoice=true&components=vaadin

[template]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22foaf%22%3A+%22http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2Fjohn-doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22schema%3AaddressCountry%22%3A+%7B%0A++++%22%40id%22%3A+%22http%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ39%22%0A++%7D%0A%7D&selectedResource=http%3A%2F%2Fexample.com%2Fjohn-doe&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+.%0A%40prefix+dash%3A+%3Chttp%3A%2F%2Fdatashapes.org%2Fdash%23%3E+.%0A%40prefix+hydra%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fhydra%2Fcore%23%3E+.%0A%40prefix+wdt%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E+.%0A%40prefix+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%0Aschema%3APerson%0A++a+rdfs%3AClass%2C+sh%3ANodeShape+%3B%0A++rdfs%3Alabel+%22Register%22+%3B%0A++sh%3Aproperty+ex%3ANameProperty+%2C+%0A%09%09++++++ex%3ACountryProperty+%2C+%0A%09%09%09++ex%3AStateProperty+%2C%0A++++++++++++++ex%3ASubStateProperty+%3B%0A.%0A%0Aex%3ANameProperty%0A++sh%3Apath+schema%3Aname+%3B%0A++sh%3Aname+%22Name%22+%3B%0A++sh%3Adatatype+xsd%3Astring+%3B%0A++dash%3AsingleLine+true+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3Aorder+10+%3B%0A.%0A%0Aex%3ACountryProperty%0A++sh%3Aname+%22Country%22+%3B%0A++sh%3Aclass+wd%3AQ6256+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++sh%3Apath+schema%3AaddressCountry+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++hydra%3Acollection+%3Chttps%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3Dprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcountry%2520.%250A%2520%2520%253Fcountry%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%250A%2520%2520%253Fcountry%2520wdt%253AP31%2520wd%253AQ6256%2520%253B%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%3E+%3B%0A++sh%3Aorder+20+%3B%0A.%0A%0A%0Aex%3AStateProperty%0A++sh%3Aname+%22State%22+%3B%0A++sh%3Apath+schema%3AaddressRegion+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++hydra%3Asearch+%5B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DPREFIX%2520wd%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fentity%252F%253E%250APREFIX%2520wdt%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fprop%252Fdirect%252F%253E%250Aprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fdivision%2520.%250A%2520%2520%253Fdivision%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%2520%2520%250A%2520%2520%253C%7BCOUNTRY%7D%253E%2520wdt%253AP150%2520%253Fdivision%2520.%250A%2520%2520%253Fdivision%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+schema%3AaddressCountry+%3B%0A++++++hydra%3Avariable+%22COUNTRY%22+%3B%0A++++++hydra%3Arequired+true+%3B%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+30+%3B%0A.%0A%0A%0Aex%3ASubStateProperty%0A++sh%3Aname+%22City%22+%3B%0A++sh%3Apath+schema%3AaddressLocality+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++hydra%3Asearch+%5B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DPREFIX%2520wd%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fentity%252F%253E%250APREFIX%2520wdt%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fprop%252Fdirect%252F%253E%250Aprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcity%2520.%250A%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%2520%250A%2520%2520%257B%250A%2520%2520%2520%2520SELECT%2520%253Fcity%2520%253Flabel%2520WHERE%2520%257B%250A%2520%2520%2520%2520%2520%2520%253C%7BSTATE%7D%253E%2520wdt%253AP150%252B%2520%253Fcity%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520wdt%253AP31%2520%253FcityType%2520.%250A%2520%2520%2520%2520%2520%2520%253FcityType%2520wdt%253AP279%2520wd%253AQ515%2520.%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2520%2520UNION%250A%2520%2520%257B%250A%2520%2520%2520%2520SELECT%2520%253Fcity%2520%253Flabel%2520WHERE%2520%257B%2520%2520%2520%2520%250A%2520%2520%2520%2520%2520%2520%253C%7BSTATE%7D%253E%2520wdt%253AP150%252B%2520%253Fcity%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520wdt%253AP31%2520wd%253AQ515%2520.%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+schema%3AaddressRegion+%3B%0A++++++hydra%3Avariable+%22STATE%22+%3B%0A++++++hydra%3Arequired+true+%3B%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+40+%3B%0A.

[search-path]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22foaf%22%3A+%22http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40graph%22%3A+%5B%0A++++%7B%0A++++++%22%40id%22%3A+%22_%3Ab0%22%2C%0A++++++%22%40type%22%3A+%22schema%3APostalAddress%22%0A++++%7D%2C%0A++++%7B%0A++++++%22%40id%22%3A+%22_%3Ab1%22%2C%0A++++++%22%40type%22%3A+%22schema%3APostalAddress%22%2C%0A++++++%22schema%3AaddressLocality%22%3A+%7B%0A++++++++%22%40id%22%3A+%22http%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ868660%22%0A++++++%7D%2C%0A++++++%22schema%3AaddressRegion%22%3A+%7B%0A++++++++%22%40id%22%3A+%22http%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ1384%22%0A++++++%7D%2C%0A++++++%22rdfs%3Alabel%22%3A+%22Mailing+address%22%0A++++%7D%2C%0A++++%7B%0A++++++%22%40id%22%3A+%22_%3Ab2%22%2C%0A++++++%22%40type%22%3A+%22schema%3APostalAddress%22%2C%0A++++++%22schema%3AaddressLocality%22%3A+%7B%0A++++++++%22%40id%22%3A+%22http%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ17042%22%0A++++++%7D%2C%0A++++++%22schema%3AaddressRegion%22%3A+%7B%0A++++++++%22%40id%22%3A+%22http%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ99%22%0A++++++%7D%2C%0A++++++%22rdfs%3Alabel%22%3A+%22Permanent+address%22%0A++++%7D%2C%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2Fjohn-doe%22%2C%0A++++++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++++++%22schema%3Aaddress%22%3A+%5B%0A++++++++%7B%0A++++++++++%22%40id%22%3A+%22_%3Ab1%22%0A++++++++%7D%2C%0A++++++++%7B%0A++++++++++%22%40id%22%3A+%22_%3Ab2%22%0A++++++++%7D%0A++++++%5D%2C%0A++++++%22schema%3AaddressCountry%22%3A+%7B%0A++++++++%22%40id%22%3A+%22http%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ30%22%0A++++++%7D%2C%0A++++++%22schema%3Aname%22%3A+%22John+Doe%22%0A++++%7D%0A++%5D%0A%7D&selectedResource=http%3A%2F%2Fexample.com%2Fjohn-doe&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+.%0A%40prefix+dash%3A+%3Chttp%3A%2F%2Fdatashapes.org%2Fdash%23%3E+.%0A%40prefix+hydra%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fhydra%2Fcore%23%3E+.%0A%40prefix+wdt%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E+.%0A%40prefix+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%0Aschema%3APerson%0A++a+rdfs%3AClass%2C+sh%3ANodeShape+%3B%0A++rdfs%3Alabel+%22Register%22+%3B%0A++sh%3Aproperty+ex%3ANameProperty+%2C%0A%09%09%09++ex%3ACountryProperty+%2C%0A++%09%09%09++ex%3AAddressProperty+%3B%0A.%0A%0Aex%3ANameProperty%0A++sh%3Apath+schema%3Aname+%3B%0A++sh%3Aname+%22Name%22+%3B%0A++sh%3Adatatype+xsd%3Astring+%3B%0A++dash%3AsingleLine+true+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3Aorder+10+%3B%0A.%0A%0Aex%3ACountryProperty%0A++sh%3Aname+%22Country%22+%3B%0A++sh%3Aclass+wd%3AQ6256+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++sh%3Apath+schema%3AaddressCountry+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++hydra%3Acollection+%3Chttps%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3Dprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcountry%2520.%250A%2520%2520%253Fcountry%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%250A%2520%2520%253Fcountry%2520wdt%253AP31%2520wd%253AQ6256%2520%253B%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%3E+%3B%0A++sh%3Aorder+20+%3B%0A.%0A%0Aex%3AAddressProperty%0A++sh%3Aname+%22Addresses%22+%3B%0A++sh%3Apath+schema%3Aaddress+%3B%0A++sh%3Anode+schema%3APostalAddress+%3B%0A++sh%3Aclass+schema%3APostalAddress+%3B%0A++sh%3Aorder+30+%3B%0A.%0A%0Aschema%3APostalAddress+%0A++a+rdfs%3AClass%2C+sh%3ANodeShape+%3B%0A++rdfs%3Alabel+%22Address%22+%3B%0A++sh%3Aproperty+ex%3ADescriptionProperty+%2C+%0A++++++++++++++ex%3AStateProperty+%2C+%0A++%09%09%09++ex%3ASubStateProperty+%3B%0A.%0A%0Aex%3ADescriptionProperty%0A++sh%3Aname+%22Description%22+%3B%0A++sh%3Apath+rdfs%3Alabel+%3B%0A++sh%3AminValue+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3AdefaultValue+%22%22+%3B%0A++sh%3Aorder+10+%3B%0A.%0A%0Aex%3AStateProperty%0A++sh%3Aname+%22State%22+%3B%0A++sh%3Apath+schema%3AaddressRegion+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++hydra%3Asearch+%5B%0A++++sh%3Apath+%5B+sh%3AinversePath+schema%3Aaddress+%5D+%3B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DPREFIX%2520wd%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fentity%252F%253E%250APREFIX%2520wdt%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fprop%252Fdirect%252F%253E%250Aprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fdivision%2520.%250A%2520%2520%253Fdivision%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%2520%2520%250A%2520%2520%253C%7BCOUNTRY%7D%253E%2520wdt%253AP150%2520%253Fdivision%2520.%250A%2520%2520%253Fdivision%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+schema%3AaddressCountry+%3B%0A++++++hydra%3Avariable+%22COUNTRY%22+%3B%0A++++++hydra%3Arequired+true+%3B%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+20+%3B%0A.%0A%0A%0Aex%3ASubStateProperty%0A++sh%3Aname+%22City%22+%3B%0A++sh%3Apath+schema%3AaddressLocality+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++hydra%3Asearch+%5B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DPREFIX%2520wd%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fentity%252F%253E%250APREFIX%2520wdt%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fprop%252Fdirect%252F%253E%250Aprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcity%2520.%250A%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%2520%250A%2520%2520%257B%250A%2520%2520%2520%2520SELECT%2520%253Fcity%2520%253Flabel%2520WHERE%2520%257B%250A%2520%2520%2520%2520%2520%2520%253C%7BSTATE%7D%253E%2520wdt%253AP150%252B%2520%253Fcity%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520wdt%253AP31%2520%253FcityType%2520.%250A%2520%2520%2520%2520%2520%2520%253FcityType%2520wdt%253AP279%2520wd%253AQ515%2520.%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2520%2520UNION%250A%2520%2520%257B%250A%2520%2520%2520%2520SELECT%2520%253Fcity%2520%253Flabel%2520WHERE%2520%257B%2520%2520%2520%2520%250A%2520%2520%2520%2520%2520%2520%253C%7BSTATE%7D%253E%2520wdt%253AP150%252B%2520%253Fcity%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520wdt%253AP31%2520wd%253AQ515%2520.%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520IN%2520%2528%2520%2527en%2527%252C%2520%2527de%2527%252C%2520%2527fr%2527%252C%2520%2527pl%2527%252C%2520%2527es%2527%2520%2529%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+schema%3AaddressRegion+%3B%0A++++++hydra%3Avariable+%22STATE%22+%3B%0A++++++hydra%3Arequired+true+%3B%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+30+%3B%0A.&nesting=inline


### Collection filtered with text input

Hydra Core defines a property `hydra:freetextQuery` which can be used to filter large collections using textual input provided by the caller.

For that, `hydra:search` template is used as above, with one variable mapped to `hydra:freetextQuery`:

```turtle
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix hydra: <http://www.w3.org/ns/hydra/core#> .
@prefix schema: <http://schema.org/> .
@prefix sh: <http://www.w3.org/ns/shacl#> .

<AddressShape> a sh:NodeShape ;
  sh:property [
    sh:path [
      sh:path schema:addressCountry ;
      hydra:search [
        a hydra:IriTemplate ;
        hydra:template "https://example.com/countries{?name}" ;
        hydra:mapping [
          hydra:property hydra:freetextQuery ;
          hydra:variable "name" ;
          sh:minLength 3 ;
        ] ;
      ] ;
    ] ;
  ] ;
.
```

> [!TIP]
> The `sh:minLength` can be used optionally to increase the minimum length of the search text which will trigger a request.

To support this, a component implementing `dash:InstanceSelectEditor` must manually fetch the filtered collection when search is performed. This is done by passing an optional `string` parameter to the functions `shouldLoad` and `loadChoices`.

```typescript
import { instancesSelect } from '@hydrofoil/shaperone-core/components'
import { html } from '@hydrofoil/shaperone-wc'

export const instancesSelectEditorWithFreeText: InstancesSelectEditor = {
  ...instancesSelect,
  render(params) {
    const loadFiltered = async () => {
      // only search if the conditions are met  
      if (!this.shouldLoad(params)) { return }
      
      // have collection loaded
      const pointers = await this.loadChoices(params)
      
      // build key/value pairs to display 
      const instances = pointers
        .map<Item>(p => [p, this.label(p, params.form)])
        .sort(this.sort)
      
      // update the component
      params.updateComponentState({ instances })  
    }  
      
    return html`<ex-autocomplete-select 
                   .options=${value.componentState.choices}
                   @input=${loadFiltered}
                ></ex-autocomplete-select>`
  },
}
```

> [!EXAMPLE]
> The package `@hydrofoil/shaperone-wc-vaadin` implements free text search. Try it out in the [playground][freetext].

[freetext]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22foaf%22%3A+%22http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2Fjohn-doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22schema%3Aname%22%3A+%22John%22%0A%7D&selectedResource=http%3A%2F%2Fexample.com%2Fjohn-doe&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+.%0A%40prefix+dash%3A+%3Chttp%3A%2F%2Fdatashapes.org%2Fdash%23%3E+.%0A%40prefix+hydra%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fhydra%2Fcore%23%3E+.%0A%40prefix+wdt%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E+.%0A%40prefix+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%0Aschema%3APerson%0A++a+rdfs%3AClass%2C+sh%3ANodeShape+%3B%0A++rdfs%3Alabel+%22Register%22+%3B%0A++sh%3Aproperty+ex%3ANameProperty+%2C+%0A%09%09++++++ex%3ACountryProperty+%2C+%0A%09%09%09++ex%3AStateProperty+%2C%0A++++++++++++++ex%3ASubStateProperty+%3B%0A.%0A%0Aex%3ANameProperty%0A++sh%3Apath+schema%3Aname+%3B%0A++sh%3Aname+%22Name%22+%3B%0A++sh%3Adatatype+xsd%3Astring+%3B%0A++dash%3AsingleLine+true+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3Aorder+10+%3B%0A.%0A%0Aex%3ACountryProperty%0A++sh%3Aname+%22Country+%28type+to+search%29%22+%3B%0A++sh%3Aclass+wd%3AQ6256+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++sh%3Apath+schema%3AaddressCountry+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++hydra%3Asearch+%5B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3Dprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcountry%2520.%250A%2520%2520%253Fcountry%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%250A%2520%2520%253Fcountry%2520wdt%253AP31%2520wd%253AQ6256%2520%253B%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%250A%2520%2520filter%2528%2520regex%2528%253Flabel%252C%2520%2522%255E%7Bq%7D%2522%252C%2520%2522i%2522%2529%2520%2529%250A%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520%253D%2520%2527en%2527%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+hydra%3AfreetextQuery+%3B%0A++++++hydra%3Avariable+%22q%22+%3B%0A++++++sh%3AminLength+3+%3B+%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+20+%3B%0A.%0A%0A%0Aex%3AStateProperty%0A++sh%3Aname+%22State%22+%3B%0A++sh%3Apath+schema%3AaddressRegion+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++hydra%3Asearch+%5B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DPREFIX%2520wd%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fentity%252F%253E%250APREFIX%2520wdt%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fprop%252Fdirect%252F%253E%250Aprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fdivision%2520.%250A%2520%2520%253Fdivision%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%2520%2520%250A%2520%2520%253C%7BCOUNTRY%7D%253E%2520wdt%253AP150%2520%253Fdivision%2520.%250A%2520%2520%253Fdivision%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520%253D%2520%2527en%2527%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+schema%3AaddressCountry+%3B%0A++++++hydra%3Avariable+%22COUNTRY%22+%3B%0A++++++hydra%3Arequired+true+%3B%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+30+%3B%0A.%0A%0A%0Aex%3ASubStateProperty%0A++sh%3Aname+%22City%22+%3B%0A++sh%3Apath+schema%3AaddressLocality+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++hydra%3Asearch+%5B%0A++++hydra%3Atemplate+%22https%3A%2F%2Fquery.wikidata.org%2Fsparql%3Fquery%3DPREFIX%2520wd%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fentity%252F%253E%250APREFIX%2520wdt%253A%2520%253Chttp%253A%252F%252Fwww.wikidata.org%252Fprop%252Fdirect%252F%253E%250Aprefix%2520hydra%253A%2520%253Chttp%253A%252F%252Fwww.w3.org%252Fns%252Fhydra%252Fcore%2523%253E%250A%250ACONSTRUCT%2520%257B%250A%2520%2520%253Fcol%2520a%2520hydra%253ACollection%2520.%250A%2520%2520%253Fcol%2520hydra%253Amember%2520%253Fcity%2520.%250A%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%257D%2520WHERE%2520%257B%250A%2520%2520BIND%2520%2528%2520%253Curn%253Acontry%253Acollection%253E%2520as%2520%253Fcol%2520%2529%250A%2520%250A%2520%2520%257B%250A%2520%2520%2520%2520SELECT%2520%253Fcity%2520%253Flabel%2520WHERE%2520%257B%250A%2520%2520%2520%2520%2520%2520%253C%7BSTATE%7D%253E%2520wdt%253AP150%252B%2520%253Fcity%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520wdt%253AP31%2520%253FcityType%2520.%250A%2520%2520%2520%2520%2520%2520%253FcityType%2520wdt%253AP279%2520wd%253AQ515%2520.%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2520%2520UNION%250A%2520%2520%257B%250A%2520%2520%2520%2520SELECT%2520%253Fcity%2520%253Flabel%2520WHERE%2520%257B%2520%2520%2520%2520%250A%2520%2520%2520%2520%2520%2520%253C%7BSTATE%7D%253E%2520wdt%253AP150%252B%2520%253Fcity%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520rdfs%253Alabel%2520%253Flabel%2520.%250A%2520%2520%2520%2520%2520%2520%253Fcity%2520wdt%253AP31%2520wd%253AQ515%2520.%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%2520%2520filter%2520%2528%2520lang%2528%253Flabel%2529%2520%253D%2520%2527en%2527%2520%2529%250A%257D%22+%3B%0A++++hydra%3Amapping+%5B%0A++++++hydra%3Aproperty+schema%3AaddressRegion+%3B%0A++++++hydra%3Avariable+%22STATE%22+%3B%0A++++++hydra%3Arequired+true+%3B%0A++++%5D+%3B%0A++%5D+%3B%0A++sh%3Aorder+40+%3B%0A.&labs=%7B%22errorSummary%22%3Afalse%7D
