package com.example.ai_powered_document.controller;

import com.example.ai_powered_document.service.DocumentIngestionService;
import com.example.ai_powered_document.service.RagService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final RagService ragService;
    private final DocumentIngestionService ingestionService;

    public AiController(RagService ragService, DocumentIngestionService ingestionService) {
        this.ragService = ragService;
        this.ingestionService = ingestionService;
    }

    @PostMapping("/ingest")
    public String ingest(@RequestBody String text) {
        ingestionService.ingest(text);
        return "Document ingested successfully!";
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return ragService.ask(q);
    }
}
