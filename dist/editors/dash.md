# DASH Forms

> [!TIP]
> DASH is a recursive acronym which stands for [DASH Data Shapes](http://datashapes.org/)

DASH is a set of auxiliary specifications by TopQuadrant's SHACL author Holger Knublauch. Specifically, [Form Generation using SHACL and DASH](http://datashapes.org/forms.html) draft is used by Shaperone as a backbone of the form definition.

## Editors

DASH defines two types of editors: `dash:SingleEditor` and `dash:MultiEditor` which represent a user input element of a form.

As the names imply, the former are editors for individual triple object while the latter replaces all values for a given property.
 
It also provides a set of instances of the `dash:SingleEditor` type. The table below lists them and indicates which are implemented as [matchers](editors/matchers.md) and [components](components/implement.md) by shaperone. Below you will also find some additional information about some of them. 

| Editor | Description | Matcher | Component |
| -- | -- | -- | -- |
| [`dash:AutoCompleteEditor`](http://datashapes.org/forms.html#AutoCompleteEditor) | A dropdown menu where users can type to get suggestions of available choices | :x: | :x: |
| [`dash:BlankNodeEditor`](http://datashapes.org/forms.html#BlankNodeEditor) | A read-only view allowing to remove the object | :x: | :x: |
| [`dash:BooleanSelectEditor`](http://datashapes.org/forms.html#BooleanSelectEditor) | A true/false selector | :heavy_check_mark: | :heavy_check_mark: |
| [`dash:DatePickerEditor`](http://datashapes.org/forms.html#DatePickerEditor) | A calendar for selecting dates | :heavy_check_mark: |  :heavy_check_mark: | 
| [`dash:DateTimePickerEditor`](http://datashapes.org/forms.html#DateTimePickerEditor) | A calendar for selecting date and time | :heavy_check_mark: | :heavy_check_mark: | 
| [`dash:DetailsEditor`](http://datashapes.org/forms.html#DetailsEditor) | A drill-down-style editor for editing child focus nodes | :heavy_check_mark: |  :x: |
| [`dash:EnumSelectEditor`](http://datashapes.org/forms.html#EnumSelectEditor) | A dropdown with choices from a closed set of elements | :heavy_check_mark: | :dragon: |
| [`dash:InstancesSelectEditor`](http://datashapes.org/forms.html#InstancesSelectEditor) | A dropdown to choose among instances a specific type as indicated by `sh:class` shape property | :heavy_check_mark: | :dragon: |
| [`dash:RichTextEditor`](http://datashapes.org/forms.html#RichTextEditor) | A text editor with formatting, which returns HTML markup | :x: | :x: |
| [`dash:TextAreaEditor`](http://datashapes.org/forms.html#TextAreaEditor) | Multiline text box | :heavy_check_mark: | :heavy_check_mark: | 
| [`dash:TextFieldEditor`](http://datashapes.org/forms.html#TextFieldEditor) | Single line text box | :heavy_check_mark: | :heavy_check_mark: | 
| [`dash:TextAreaWithLangEditor`](http://datashapes.org/forms.html#TextAreaWithLangEditor) | Multiline text box with additional input to select language tag | :heavy_check_mark: | :x: |
| [`dash:TextFieldWithLangEditor`](http://datashapes.org/forms.html#TextFieldWithLangEditor) | Single line text box with additional input to select language tag | :heavy_check_mark: |  :x: | 
| [`dash:URIEditor`](http://datashapes.org/forms.html#URIEditor) | A text box for typing in URIs | :heavy_check_mark: | :heavy_check_mark: |

> [!NOTE]
> Most of the default behaviour of components can be easily customized in your application. The [components page](components/implement.md) provides information about necessary implementation steps.

## dash:EnumSelectEditor

The enum selector is typically rendered as a dropdown menu with a set of choices which a SHACL [`PropertyShape`](https://www.w3.org/TR/shacl/#property-shapes) declares by using the [`sh:in` constraint](https://www.w3.org/TR/shacl/#InConstraintComponent) 

The default behaviour is to present literal values directly and enumeration of resources (named nodes or blank nodes) will use any `rdfs:label` value found in the **shapes graph** 

```turtle
ex:Shape a sh:NodeShape ;
  sh:property [
    sh:path ex:foobar ;
    sh:name "Foo or bar?" ;
    sh:in ( "Foo" "Bar" ) ;
  ] ;
  sh:property [
    sh:path ex:language ;
    sh:name "Language" ;
    sh:in ( lexvo:en lexvo:de ) ;
  ] ;
.

lexvo:en rdfs:label "English" .
```

> [!EXAMPLE]
> Open the above example in [the playground][enumExample] to se how the form renders `dash:EnumSelectEditor` components in a complete setup.

## dash:InstancesSelectEditor

Similarly to the enum select above, an "instances selector" presents a dropdown, by default populated with instances of a given `sh:class` found in the shapes graph.

```turtle
ex:Shape a sh:NodeShape ;
  sh:property [
    sh:path schema:alumniOf ;
    sh:class wd:Q3918 ;
    sh:name "Alma mater" ;
  ] ;
.

wd:Q184478 a wd:Q3918 ; rdfs:label "University of California" .
wd:Q1860208 a wd:Q3918 ; rdfs:label "National University of Ireland" .
wd:Q49108 a wd:Q3918 ; rdfs:label "Massachusetts Institute of Technology" .
wd:Q34433 a wd:Q3918 ; rdfs:label "University of Oxford" .
wd:Q35794 a wd:Q3918 ; rdfs:label "University of Cambridge" .
wd:Q13371 a wd:Q3918 ; rdfs:label "Harvard University" .
```

In this snippet a form will present the user with a list of wikidata university instances. Again, here the default behaviour is to use `rdfs:label` as the display text for each option. 

> [!EXAMPLE]
> Open the above example in [the playground][instancesExample] to see how the form renders `dash:InstancesSelectEditor` components in a complete setup.

> [!TIP]
> [Hydra integration library](extensions/hydra.md) can be used to extend the functionality of Instances Select editor so that instance data is dereferenced from external resources. 

[enumExample]: ${playground}/#shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E+.%0A%40prefix+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%40prefix+lexvo%3A+%3Chttp%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2F%3E+.%0A%0Aex%3AShape+a+sh%3ANodeShape+%3B%0A++sh%3AtargetClass+schema%3APerson+%3B%0A++sh%3Aproperty+%5B%0A++++sh%3Apath+ex%3Afoobar+%3B%0A++++sh%3Aname+%22Foo+or+bar%3F%22+%3B%0A++++sh%3Ain+%28+%22Foo%22+%22Bar%22+%29+%3B%0A++++sh%3AminCount+1+%3B%0A++++sh%3AmaxCount+1+%3B%0A++%5D+%3B%0A++sh%3Aproperty+%5B%0A++++sh%3Apath+ex%3Alanguage+%3B%0A++++sh%3Aname+%22Language%22+%3B%0A++++sh%3Ain+%28+lexvo%3Aen+lexvo%3Ade+%29+%3B%0A++++sh%3AmaxCount+2+%3B%0A++%5D+%3B%0A.%0A%0Alexvo%3Aen+rdfs%3Alabel+%22English%22+.%0A&resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22foaf%22%3A+%22http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2FJohn_Doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22http%3A%2F%2Fexample.com%2Ffoobar%22%3A+%22Foo%22%2C%0A++%22http%3A%2F%2Fexample.com%2Flanguage%22%3A+%5B%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2Fen%22%0A++++%7D%2C%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2Fde%22%0A++++%7D%0A++%5D%0A%7D

[instancesExample]: ${playground}/#resource=%40prefix+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E+.%0A%40prefix+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E+.%0A%0A_%3Ab0+a+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ3918%3E+.%0A%0A_%3Ab1+a+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ3918%3E+.%0A%0A%3Chttp%3A%2F%2Fexample.com%2FJohn_Doe%3E+a+schema%3APerson+%3B%0A%09schema%3AalumniOf+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ1860208%3E%2C+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2FQ13371%3E+.%0A%0A&selectedResource=http%3A%2F%2Fexample.com%2FJohn_Doe&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+dash%3A+%3Chttp%3A%2F%2Fdatashapes.org%2Fdash%23%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%0Aex%3AShape+a+sh%3ANodeShape+%3B%0A++sh%3AtargetClass+schema%3APerson+%3B%0A++sh%3Aproperty+%5B%0A++++sh%3Apath+schema%3AalumniOf+%3B%0A++++sh%3Aclass+wd%3AQ3918+%3B%0A++++sh%3Aname+%22Alma+mater%22+%3B%0A++++dash%3Aeditor+dash%3AInstancesSelectEditor+%3B%0A++%5D+%3B%0A.%0A%0Awd%3AQ184478+a+wd%3AQ3918+%3B+rdfs%3Alabel+%22University+of+California%22+.%0Awd%3AQ1860208+a+wd%3AQ3918+%3B+rdfs%3Alabel+%22National+University+of+Ireland%22+.%0Awd%3AQ49108+a+wd%3AQ3918+%3B+rdfs%3Alabel+%22Massachusetts+Institute+of+Technology%22+.%0Awd%3AQ34433+a+wd%3AQ3918+%3B+rdfs%3Alabel+%22University+of+Oxford%22+.%0Awd%3AQ35794+a+wd%3AQ3918+%3B+rdfs%3Alabel+%22University+of+Cambridge%22+.%0Awd%3AQ13371+a+wd%3AQ3918+%3B+rdfs%3Alabel+%22Harvard+University%22+.%0A
