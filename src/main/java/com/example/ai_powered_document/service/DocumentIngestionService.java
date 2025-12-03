package com.example.ai_powered_document.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;


import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentIngestionService {
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    public DocumentIngestionService(EmbeddingModel embeddingModel,
                                    EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
    }
    public void ingest(MultipartFile file){
        try{
            Document doc = new ApachePdfBoxDocumentParser().parse(file.getInputStream());
            DocumentSplitter splitter = DocumentSplitters.recursive(1000, 200);//(maxSegmentSize, int overlapSize)
                    
            List<TextSegment> segments = splitter.split(doc);

            for(TextSegment chunk : segments){   // Makes the chunks smaller for better embeddings. Can't pass whole book because llm may not handle that size.
                Embedding embedding = embeddingModel.embed(chunk).content();  // Embedding is just a placeholder for holding the embedding result
                embeddingStore.add(embedding, chunk);
            }
        }catch(Exception e){
            throw new RuntimeException("Failed to ingest document: " + e.getMessage());
        }
    }
    
}
