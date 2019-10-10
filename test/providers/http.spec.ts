import {AngularRequestOptions, HttpResponse, JsonValidationError, RequestOptions, toAngularOptions} from "../../src/providers/http";
import {HttpHeaders, HttpParams, HttpResponse as Response} from "@angular/common/http";

describe("request options to angular options", () => {

  context("on defined headers and params", () => {

    it("should create angular request options with headers and params", () => {

      const opt: RequestOptions = <RequestOptions>{
        headers: [["Some-Header", "with its value"]],
        urlParams: [["some-param", "and its value"]]
      };


      const result: AngularRequestOptions = toAngularOptions(opt);


      const expected: AngularRequestOptions = <AngularRequestOptions>{
        observe: "response",
        responseType: "arraybuffer",
        withCredentials: false,
        reportProgress: false,
        headers: new HttpHeaders().set("Some-Header", "with its value"),
        params: new HttpParams().set("some-param", "and its value")
      };
      chai.expect(result)
        .to.be.deep.equal(expected);
    });
  });

  context("on undefined headers and params", () => {

  	it("should create angular request options without headers and params", () => {

      const result: AngularRequestOptions = toAngularOptions(<RequestOptions>{});


      const expected: AngularRequestOptions = <AngularRequestOptions>{
        observe: "response",
        responseType: "arraybuffer",
        withCredentials: false,
        reportProgress: false,
        headers: new HttpHeaders(),
        params: new HttpParams()
      };
      chai.expect(result)
        .to.be.deep.equal(expected);
  	})
  });
});

describe("a http response", () => {

	describe("a json schema to validate", () => {

    const schema: object = {
      "title": "Testschema",
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "minimum": "1"
        },
        "name": {
          "type": "string"
        },
      },
      "required": ["id", "name"]
    };

		context("on valid json", () => {

			it("should return the json as object", () => {

        const text: string = '{"id": 1, "name": "a test"}';
        const mockResponse: Response<ArrayBuffer> = new Response({body: strToBuffer(text)});


        const httpResponse: HttpResponse = new HttpResponse(mockResponse);
        const json: object = httpResponse.json(schema);


        chai.expect(json)
          .to.be.deep.equal(JSON.parse(text));
			});
		});

		context("on json does not match schema", () => {

			it("should throw a json validation error", () => {

        const text: string = '{"foo": 1}';
        const mockResponse: Response<ArrayBuffer> = new Response({body: strToBuffer(text)});


        const httpResponse: HttpResponse = new HttpResponse(mockResponse);

        chai.expect((): void => { httpResponse.json(schema) })
          .to.throw(JsonValidationError)
          .to.have.property("message", "Response body does not match json schema");
			})
		});

		context("on response body is not json", () => {

			it("should throw a json validation error", () => {

        const text: string = "this is not json @: 4";
        const mockResponse: Response<ArrayBuffer> = new Response({body: strToBuffer(text)});


        const httpResponse: HttpResponse = new HttpResponse(mockResponse);

        chai.expect((): void => { httpResponse.json(schema) })
          .to.throw(JsonValidationError)
          .to.have.property("message", "Could not parse response body to json")
			})
		});
	});

  describe("an array buffer to text", () => {

    context("on UTF-8 encoded text", () => {

      it("should return the text representation of the array buffer", () => {

        const text: string = "text to read";
        const mockResponse: Response<ArrayBuffer> = new Response({body: strToBuffer(text)});


        const httpResponse: HttpResponse = new HttpResponse(mockResponse);
        chai.expect(httpResponse.text())
          .to.be.equal(text);
      });
    });
  });
});

function strToBuffer(value: string): ArrayBuffer {
  const buffer: ArrayBuffer = new ArrayBuffer(value.length); // 1 byte for each character
  const bufferView: Uint8Array = new Uint8Array(buffer);
  for (let i: number = 0; i < value.length; i++) {
    bufferView[i] = value.charCodeAt(i);
  }
  return buffer;
}
