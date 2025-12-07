package com.example.ai_powered_document.controller;

import com.example.ai_powered_document.service.DocumentIngestionService;
import com.example.ai_powered_document.service.RagService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final RagService ragService;
    private final DocumentIngestionService ingestionService;

    public AiController(RagService ragService, DocumentIngestionService ingestionService) {
        this.ragService = ragService;
        this.ingestionService = ingestionService;
    }

    @PostMapping("/ingest/upload")
    public String ingest(@RequestParam("file") MultipartFile file) {
        System.out.println("Received file: " + file.getOriginalFilename());
        ingestionService.ingest(file);
        return "Document ingested successfully!";
    }

    @GetMapping("/ask")
    public String ask(@RequestParam("question") String q) {
        return ragService.ask(q);
    }
}
