export namespace main {
	
	export class Result {
	    success: boolean;
	    outputPath: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.outputPath = source["outputPath"];
	        this.error = source["error"];
	    }
	}

}

export namespace service {
	
	export class PdfPagePreview {
	    pageNumber: number;
	    imageData: string;
	    width: number;
	    height: number;
	
	    static createFrom(source: any = {}) {
	        return new PdfPagePreview(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.pageNumber = source["pageNumber"];
	        this.imageData = source["imageData"];
	        this.width = source["width"];
	        this.height = source["height"];
	    }
	}
	export class ProcessResult {
	    success: boolean;
	    outputPath: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new ProcessResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.outputPath = source["outputPath"];
	        this.error = source["error"];
	    }
	}

}

