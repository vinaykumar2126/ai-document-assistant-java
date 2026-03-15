package com.example.ai_powered_document.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnBean(EmbeddingModel.class)
public class DocumentIngestionService {
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final String aiProvider;
    private final String ollamaEmbeddingModel;

    public DocumentIngestionService(EmbeddingModel embeddingModel,
                                    EmbeddingStore<TextSegment> embeddingStore,
                                    @Value("${ai.provider:ollama}") String aiProvider,
                                    @Value("${ollama.embedding.model:nomic-embed-text}") String ollamaEmbeddingModel) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
        this.aiProvider = aiProvider;
        this.ollamaEmbeddingModel = ollamaEmbeddingModel;
    }

    public void ingest(MultipartFile file){
        try {
        String fileName = file.getOriginalFilename();
        String text;

        if (fileName.endsWith(".pdf")) {
            Document doc = new ApachePdfBoxDocumentParser().parse(file.getInputStream());
            text = doc.text();
        } else if (fileName.endsWith(".txt")) {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                text = reader.lines().reduce("", (a, b) -> a + "\n" + b);
            }
        } else if (fileName.endsWith(".docx")) {
            try (InputStream is = file.getInputStream()) {
                XWPFDocument docx = new XWPFDocument(is);
                text = docx.getParagraphs().stream()
                        .map(p -> p.getText())
                        .reduce("", (a, b) -> a + "\n" + b);
            }
        } else {
            throw new RuntimeException("Unsupported file type: " + fileName);
        }
        Document doc = new Document(text);
        DocumentSplitter splitter = DocumentSplitters.recursive(1000, 200);
        List<TextSegment> segments = splitter.split(doc);

        for (TextSegment chunk : segments) {
            Embedding embedding = embeddingModel.embed(chunk).content();
            embeddingStore.add(embedding, chunk);
        }

        } catch (ResponseStatusException e) {
            throw e;
        }catch(Exception e){
            String message = e.getMessage();

            if ("ollama".equalsIgnoreCase(aiProvider)
                    && message != null
                    && message.contains("try pulling it first")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Ollama embedding model '" + ollamaEmbeddingModel
                                + "' is not available locally. Run: ollama pull "
                                + ollamaEmbeddingModel + " and try the upload again.");
            }

            throw new RuntimeException("Failed to ingest document: " + message, e);
        }
    }
    
}
