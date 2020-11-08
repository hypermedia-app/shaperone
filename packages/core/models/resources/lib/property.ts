import {PropertyShape} from '@rdfine/shacl';
import {Resource} from '@rdfine/rdfs';

export function getPathProperty(shape: PropertyShape): Resource {
  return (Array.isArray(shape.path) ? shape.path[0] : shape.path)!
}
