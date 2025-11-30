package zotte.dingen.cqrs.conversation;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationRepository repo;
    private final ConversationValidator conversationValidator;

    public ConversationController(ConversationRepository repo, ConversationValidator conversationValidator) {
        this.repo = repo;
        this.conversationValidator = conversationValidator;
    }

    @GetMapping
    @CrossOrigin
    public ResponseEntity<List<Conversation>> all() {
        System.out.println("bitch");
        List<Conversation> conversations = repo.findAll(Sort.by(Sort.Direction.DESC, "createdOn"));
        return ResponseEntity.ok(conversations);
    }

    @PostMapping
    public ResponseEntity<Conversation> create(@RequestBody Conversation newConversation) {
        if (!conversationValidator.validate(newConversation)) {
            return ResponseEntity.badRequest()
                    .header("Application-Error", "The conversation you tried to create is invalid")
                    .build();
        }
        Conversation conv = repo.save(newConversation);
        URI uri = UriComponentsBuilder
                .fromPath("/conversations/{id}")
                .buildAndExpand(conv.getId())
                .toUri();

        return ResponseEntity.created(uri).body(conv);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conversation> get(@PathVariable("id") String id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        if (repo.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conversation> update(@PathVariable("id") String id,
                                               @RequestBody Conversation updatedConversation) {
        if (repo.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        repo.save(updatedConversation);
        return ResponseEntity.ok(updatedConversation);
    }
}

